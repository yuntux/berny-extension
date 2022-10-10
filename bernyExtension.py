import uuid
import time
import datetime
import pytz

import flask
from flask import Response
from flask import request, redirect, render_template
from flask import url_for
from flask import jsonify
from flask_oauthlib.client import OAuth
from flask import session

import config


import mailchimp_marketing as MailchimpMarketing
from mailchimp_marketing.api_client import ApiClientError
import json
import hashlib
import requests

from threading import Lock
import os.path


#date_jour = datetime.date.today().isoformat()


APP = flask.Flask(__name__, template_folder='static/templates')
#APP.secret_key = config.APP_SECRET_KEY

from flask_session import Session
APP.config["SESSION_PERMANENT"] = False
APP.config["SESSION_TYPE"] = "filesystem"
Session(APP)

OAUTH = OAuth(APP)
MSGRAPH = OAUTH.remote_app(
    'microsoft', consumer_key=config.CLIENT_ID, consumer_secret=config.CLIENT_SECRET,
    request_token_params={'scope': config.SCOPES},
    base_url=config.RESOURCE + config.API_VERSION + '/',
    request_token_url=None, access_token_method='POST',
    access_token_url=config.AUTHORITY_URL + config.TOKEN_ENDPOINT,
    authorize_url=config.AUTHORITY_URL + config.AUTH_ENDPOINT)


@APP.route('/')
def homepage():
    """Render the home page."""
    return flask.render_template('homepage.html')


@APP.route('/about')
def about():
    return flask.render_template('about.html')

def empty_session():
    #flask.session = {} => /!\ Cela casse complètement le fonctionnement des sessions
    #flask.session.clear()
    [flask.session.pop(key) for key in list(flask.session.keys()) if key != '_flashes']


def is_session_valid():
    d = datetime.datetime.now().isoformat()
    if 'token_expires_at' in flask.session.keys():
        pass
        #APP.logger.debug('Test de la flask.session courante : %s * %s', d, flask.session['token_expires_at'])
        #print("Test de la flask.session courante", d > flask.session['token_expires_at'], d, ">", flask.session['token_expires_at'])
    else : 
        APP.logger.debug("'token_expires_at' non defini")
    if ('access_token' not in flask.session.keys()) or (not flask.session['access_token']) or (d > flask.session['token_expires_at']):
        APP.logger.debug("SESSION INVALIDE")
        if ('token_expires_at' in flask.session.keys()  and 'refresh_token' in flask.session.keys() and d > flask.session['token_expires_at']):
            APP.logger.debug('La flask.session va être rafraichie')
            response = refresh_credentials(flask.session['refresh_token'])
            if 'access_token' not in response.keys():
                APP.logger.error("Impossible de rafraichir la flask.session à partir du refresh_token")
                empty_session()
                return False
            initSessionTokens(response)
            APP.logger.debug('Session rafraichie')
            return True
        empty_session()
        return False
    return True

@APP.route('/login')
def login():
    """Prompt user to authenticate."""
    empty_session()
    flask.session['state'] = str(uuid.uuid4())
    flask.session['redirect_target'] = request.args.get('redirect')
    return MSGRAPH.authorize(callback=config.REDIRECT_URI, state=flask.session['state'])

@APP.route("/logout")
def logout():
    empty_session()
    return redirect(config.AUTHORITY_URL + config.LOGOUT_ENDPOINT + "?post_logout_redirect_uri=https://beta.tasmane.com")

def initSessionTokens(response):
    #print("MSGRAPH auth response : ", response)
    flask.session['access_token'] = response['access_token']
    APP.logger.debug("New access token : %s", flask.session['access_token'])
    #response['expires_in'] = 5
    d = datetime.datetime.now() + datetime.timedelta(seconds=response['expires_in'])
    expire_date = d.isoformat()
    flask.session['token_expires_at'] = expire_date
    if 'refresh_token' in response.keys(): #MS ne retourne pas de refresh_token si offline_access n'est pas intégré au scope
        flask.session['refresh_token'] = response['refresh_token']
    APP.logger.debug("SESSION EXPIRES AT %s / expire in %s", flask.session['token_expires_at'], response['expires_in'])



@APP.route(config.REDIRECT_PATH)
def authorized():
    """Handler for the application's Redirect Uri."""
    if str(flask.session['state']) != str(flask.request.args['state']):
        raise Exception('state returned to redirect URL does not match!')
    response = MSGRAPH.authorized_response()
    initSessionTokens(response)

    endpoint = 'me/memberOf'
    headers = {'SdkVersion': 'sample-python-flask',
               'x-client-SKU': 'sample-python-flask',
               'client-request-id': str(uuid.uuid4()),
               'return-client-request-id': 'true'}
    groups = MSGRAPH.get(endpoint, headers=headers).data['value']
    insideAuthorizedGroup = False
    for group in groups:
        if group['id'] == config.ID_AUTHORIZED_GROUP:
            insideAuthorizedGroup = True
    if insideAuthorizedGroup == False:
        empty_session()
        APP.logger.error("L'utilisateur n'appartient pas au groupe autorisé (groupe ID = %s)", config.ID_AUTHORIZED_GROUP)
        return "ERREUR : Vous n'apparatenez pas au groupe authorisé à accéder à cette fonction"

    endpoint = 'me'
    headers = {'SdkVersion': 'sample-python-flask',
               'x-client-SKU': 'sample-python-flask',
               'client-request-id': str(uuid.uuid4()),
               'return-client-request-id': 'true'}
    graphdata = MSGRAPH.get(endpoint, headers=headers).data
    
    flask.session['displayName'] = graphdata['displayName']
    flask.session['mail'] = graphdata['mail']
    redirect_target = flask.session['redirect_target']
    if redirect_target == None:
        redirect_target = "/"
    del flask.session['redirect_target']
    return flask.redirect(redirect_target)


def refresh_credentials(refresh_token):
    data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': MSGRAPH.consumer_key,
        'client_secret': MSGRAPH.consumer_secret}
    response = requests.post(MSGRAPH.access_token_url, data=data)
    credentials = response.json()
    return credentials

@APP.route('/mailchimpData')
def mailchimpData():
    if is_session_valid()==False:
        return flask.redirect( url_for('login', redirect='/mailchimpData'))

    members = mailchimpListMembers()

    return jsonify(members)


@APP.route('/contact_ms_graph2mailchimpData')
def contact_ms_graph2mailchimpData():
    if is_session_valid()==False:
        return flask.redirect( url_for('login', redirect='/contact_ms_graph2mailchimpData'))
    
    ########## RECUPERER LES CONTACTS MAILCHIMP
    members = mailchimpListMembers()
    mailchimpMembersMails = [d['email_address'].lower() for d in members]

    ########## RECUPERER LES CONTACTS MS GRAPH
    contacts = []
    offset = 0
    while (True) :
        # DOCUMENTATION : https://docs.microsoft.com/fr-fr/graph/people-example
        endpoint = 'me/people?$top='+str(config.MSGRAPH_PAGE_SIZE)+'&select=displayName,scoredEmailAddresses&skip='+str(offset)
        headers = {'SdkVersion': 'sample-python-flask',
                   'x-client-SKU': 'sample-python-flask',
                   'client-request-id': str(uuid.uuid4()),
                   'return-client-request-id': 'true'}
        graphdata = MSGRAPH.get(endpoint, headers=headers).data
        contacts.extend(graphdata["value"])
        if (len(graphdata["value"]) < config.MSGRAPH_PAGE_SIZE):
            break
        offset = offset + config.MSGRAPH_PAGE_SIZE 
    APP.logger.debug("=== REPONSE MS GRAPH === %s %s", flask.session['access_token'], str(len(contacts)))

    ########## STRUCTURER LES CONTACTS MICROSOFT AU FORMAT CIBLE
    res = []
    compteur_deja_dans_mailchimp = 0
    compteur_email_ms_graph = 0
    for contact in contacts:
        for mail in contact["scoredEmailAddresses"]:
            if config.DOMAIN_EXCLUSION in mail["address"] :
                continue
            compteur_email_ms_graph += 1
            if mail["address"].lower() in mailchimpMembersMails : #ne retourner que les contacts Outlook qui ne sont pas encore dans mailchimp
                compteur_deja_dans_mailchimp += 1
                #APP.logger.debug("CONTACT déjà dans mailchimp ->  %s", str(mail['address']))
                continue

            computed_fname = ""
            computed_lname = ""
            l = mail["address"].split("@")[0].split('.')
            computed_fname = l[0].title()
            if (len(l) > 1):
                computed_lname = '.'.join(l[1:]).upper()

            societe =  getMappingDomaineSocietes(mail["address"])
            if societe == "":
                domain_target = mail["address"].split("@")[1]
                d = domain_target.split(".")
                d.pop()
                societe = ".".join(d).upper()
            merge_fields = {'FNAME' : computed_fname, 'LNAME' : computed_lname, 'SOCIETE':societe}
            tagBD =  getMappingDomaineTags(mail["address"])
            tagUser = getMappingUserTags(flask.session['mail'])
            res.append({'displayName': contact['displayName'], 'email_address' : mail["address"], 'last_changed':'2000-01-01', 'status' : 'new', 'tags':tagBD+tagUser, 'merge_fields' : merge_fields})
    APP.logger.debug("Tous contacts MSGRAPH hors domaine exclu: %s", str(compteur_email_ms_graph))
    APP.logger.debug("Dejà dans mailchimp: %s", str(compteur_deja_dans_mailchimp))
    APP.logger.debug("RETOUR /contact_ms_graph2mailchimpData -> Nombre contacts : %s", str(len(res)))
    return jsonify(res)


def mailchimpListMembers():
    def appelsApiMembres(last_change=None):
        try:
          client = MailchimpMarketing.Client()
          client.set_config({
            "api_key": config.MAILCHIMP_API_KEY,
            "server": config.MAILCHIMP_SERVER_PREFIX
          })  
          
          members = []
          offset = 0
          fl=["members.email_address","members.full_name","members.id","members.contact_id","members.last_changed","members.list_id","members.merge_fields","members.status","members.tags","members.unique_email_id","members.vip","members.web_id"]
          while (True) :
            if (last_change == None):
                response = client.lists.get_list_members_info(config.MAILCHIMP_LIST_ID, offset=offset, count=config.MAILCHIMP_PAGE_SIZE, fields=fl)
            else :
                last_change_utc = datetime.datetime.fromisoformat(last_change).astimezone(pytz.utc).isoformat()
                #print(last_change, last_change_utc)
                response = client.lists.get_list_members_info(config.MAILCHIMP_LIST_ID, offset=offset, count=config.MAILCHIMP_PAGE_SIZE, fields=fl, since_last_changed=last_change_utc)
            #TODO : si code HTTP retour = 429, attendre une seconde et recommencer
            members.extend(response['members'])
            if (len(response['members']) < config.MAILCHIMP_PAGE_SIZE):
                break
            offset = offset + config.MAILCHIMP_PAGE_SIZE 

          for member in members:
              tags = [d['name'] for d in member['tags']]
              member["tags"] = sorted(tags)
          return members
          
        except ApiClientError as error:
          print("Error: {}".format(error.text))
          return False

    chemin_fichier = config.FICHIER_CACHE_MEMBRES_MAILCHIMP
    d = datetime.datetime.now() + datetime.timedelta(minutes=config.CACHE_MEMBRES_MAILCHIMP_DELAI_MINUTE_LAST_CHANGED)
    d_format = d.isoformat()
    if not os.path.exists(chemin_fichier):
        data = {'last_changed' : d_format}
        data['members'] = appelsApiMembres()
        with open(chemin_fichier, 'w') as f:
            json.dump(data, f, indent=4)

    else :
        with open(chemin_fichier, 'r') as j:
            data = json.loads(j.read())
        changed_members = appelsApiMembres(data["last_changed"])
        APP.logger.debug('Nombre de membres ayant changé depuis %s : %s', data['last_changed'], str(len(changed_members)))
        data['last_changed'] = d_format
        for changed_member in changed_members :
            maj = False
            for i in range(len(data['members'])):
                if changed_member['email_address'] == data['members'][i]['email_address']:
                    #Mise à jour des membres déjà existants dans le cache
                    data['members'][i] = changed_member
                    maj = True
            if maj == False:
                #Ajout des nouveaux membres
                data['members'].append(changed_member)

        #TODO : la suppression définive de fiches sur Mailchimp ne remontent pas par API et restent dans le cache.
            #il faut supprimer le cache
            #la bonne pratique est de ne jamais supprimer une fiche définitivement mais d'archiver le contact... mais l'API ne les retourne plus après archivage
            #on peut aussi simplement le passer au statut unsubscribed sur l'IHM Mailchimp... mais dans ce cas il continue à nous être facturé

        if len(changed_members) > 0:
            lock_cache_members = Lock() 
            with lock_cache_members:
                with open(chemin_fichier, 'w') as f:
                    json.dump(data, f, indent=4)

    
    #on supprime ne retourne pas les tags qui sont toujours dans le cache du membre mais qui n'existe plus sur Mailchimp (tags supprimés sans MAJ du cache des membres)
    at = activeTagList()
    for m in data['members']:
        t=[]
        for tag in m['tags'] :
            if tag in at:
              t.append(tag)
        m['tags'] = t
    return data['members']

@APP.route('/mailchimpAdd', methods=['POST'])
def mailchimpAdd():
    if is_session_valid()==False:
        return flask.redirect( url_for('login', redirect='/'))
    form = json.loads(request.form.getlist('values')[0])
    email_address =  form['email_address']
    if 'tags' in form.keys():
        form['added_tags'] = form['tags']
    return mailchimpAddUpdate("add", email_address, form)

@APP.route('/mailchimpUpdate', methods=['PUT'])
def mailchimpUpdate():
    if is_session_valid()==False:
        return flask.redirect( url_for('login', redirect='/'))
    form = json.loads(request.form.getlist('values')[0])
    email_address = request.form.getlist('key')[0]
    return mailchimpAddUpdate("update", email_address, form)

def mailchimpAddUpdate(type_action, email_address, form):
    try:
        client = MailchimpMarketing.Client()
        client.set_config({
            "api_key": config.MAILCHIMP_API_KEY,
            "server": config.MAILCHIMP_SERVER_PREFIX
        })

        h = hashlib.md5(email_address.lower().encode()).hexdigest()


        # CREATION ou MISE A JOUR DU MEMBRE
        d = dict({"email_address": email_address})
        # Liste des statuts que peut prendre un contact mailchimp : https://mailchimp.com/fr/help/about-your-contacts/
        if ('status' in ['', 'new']):
            s = form['status']
            if s in ['', 'new']:
                d['status'] = "subscribed"
            else :
                d['status'] = s
        else :
            if type_action == 'add':
                d['status'] = "subscribed"


        if ('merge_fields' in form.keys()):
            d['merge_fields'] = form['merge_fields']

        APP.logger.debug("atttributs : %s", d)
        response = client.lists.set_list_member(config.MAILCHIMP_LIST_ID, h, d)
        #TODO : si code HTTP retour = 429, attendre une seconde et recommencer


        #MISE A JOUR DES TAGS
        t = []
        if ('added_tags' in form.keys()):
            for tag in form['added_tags']:
                t.append(dict({"name": tag, "status": "active"}))
        if ('deleted_tags' in form.keys()):
            for tag in form['deleted_tags']:
                t.append(dict({"name": tag, "status": "inactive"}))

        APP.logger.debug("%s => tags : %s", email_address, t)
        if (len(t) > 0):
            response_update_list_member_tags = client.lists.update_list_member_tags(config.MAILCHIMP_LIST_ID, h, {'tags':t})
            #TODO : si code HTTP retour = 429, attendre une seconde et recommencer

        incrementMappingDomaineSocietes(response["email_address"], response['merge_fields']['SOCIETE'], response['last_changed'])
        del(response['_links'])
        response["tags"] = []
        if ('tags' in form.keys()):
            response["tags"] = sorted(form['tags'])
        incrementMappingDomaineTags(response["email_address"], response['tags'], response['last_changed'])

        return jsonify(response)

    except ApiClientError as error:
        APP.logger.error("Error: {}".format(error.text))
        error_dic = json.loads(error.text)
        return jsonify(error.text), error_dic["status"]
    return Response(jsonify("Erreur"), 500)


def list_prod_active():
    is_prod = False
    if config.MAILCHIMP_LIST_ID == config.MAILCHIMP_LIST_ID_PRODUCTION:
        is_prod = True
    return is_prod

@APP.route('/mailchimp')
def mailchimp():
    if is_session_valid()==False:
        return flask.redirect( url_for('login', redirect='/mailchimp'))
    response = mailchimpLists()
    return flask.render_template('tableau_mailchimp.html', 
                                    list_id_api=response['id'],
                                    list_id_web=response['web_id'], 
                                    list_name=response['name'], 
                                    list_prod_active=list_prod_active(),
                                    loadUrlendpoint = "/mailchimpData",
                                    titre = "Liste des contacts Mailchimp",
                                    showDiplayNameColumn = False,
                                    message = "Cette page liste tous les contacts stockés dans Mailchimp, quel que soit l'utilisateur qui les a saisis.")

@APP.route('/maj_cache')
def majCache():
    if is_session_valid()==False:
        return flask.redirect( url_for('login', redirect='/maj_cache'))

    if os.path.exists(config.FICHIER_MAPPING_DOMAINE_SOCIETES):
        os.remove(config.FICHIER_MAPPING_DOMAINE_SOCIETES)

    if os.path.exists(config.FICHIER_MAPPING_DOMAINE_TAGS):
        os.remove(config.FICHIER_MAPPING_DOMAINE_TAGS)

    if os.path.exists(config.FICHIER_CACHE_MEMBRES_MAILCHIMP):
        os.remove(config.FICHIER_CACHE_MEMBRES_MAILCHIMP)

    if os.path.exists(config.FICHIER_CACHE_TAGS_MAILCHIMP):
        os.remove(config.FICHIER_CACHE_TAGS_MAILCHIMP)

    if os.path.exists(config.FICHIER_CACHE_LIST_MAILCHIMP):
        os.remove(config.FICHIER_CACHE_LIST_MAILCHIMP)

    return flask.redirect("/contact_ms_graph2mailchimp") #contact_ms_graph2mailchimp permet de recharger les 4 fichiers de cache, y compris FICHIER_MAPPING_DOMAINE_SOCIETES
    

def getMappingDomaineSocietes(address):
    chemin_fichier = config.FICHIER_MAPPING_DOMAINE_SOCIETES
    domain_target = address.split("@")[1]
    if not os.path.exists(chemin_fichier):
        mapping = {}
        members = mailchimpListMembers()
        for member in members :
            domain = member['email_address'].split("@")[1]
            societe = member['merge_fields']['SOCIETE']
            if (len(societe) == 0):
                continue
            if domain not in mapping.keys():
                mapping[domain] = {}
            if societe not in mapping[domain].keys():
                d = {'societe' : societe, 'member_last_change' : member['last_changed']}
                mapping[domain][societe] = d 
            else :
                if (mapping[domain][societe]['member_last_change'] < member['last_changed']):
                    mapping[domain][societe]['member_last_change'] = member['last_changed']

        with open(chemin_fichier, 'w') as f:
            json.dump(mapping, f, indent=4)

    else :
        with open(chemin_fichier, 'r') as j:
            mapping = json.loads(j.read())

    
    if domain_target in mapping.keys():
        mapping_domain = mapping[domain_target]
        mapping_ordered = list(dict(sorted(mapping_domain.items(), key=lambda item: item[1]['member_last_change'], reverse=True)).keys())
        return mapping_ordered[0]
    else : 
        return ""

def incrementMappingDomaineSocietes(address, societe, last_changed):
    lock_incrementMappingDomaineSocietes = Lock() 
    with lock_incrementMappingDomaineSocietes:
        chemin_fichier = config.FICHIER_MAPPING_DOMAINE_SOCIETES
        if not os.path.exists(chemin_fichier):
            return False
        if (len(societe) == 0):
            return False
        domain = address.split("@")[1]
        with open(chemin_fichier, 'r') as j:
            mapping = json.loads(j.read())
        if domain not in mapping.keys():
            mapping[domain] = {}
        if societe not in mapping[domain].keys():
            d = {'societe' : societe, 'member_last_change' : last_changed}
            mapping[domain][societe] = d
        else :
            if (mapping[domain][societe]['member_last_change'] < last_changed):
                mapping[domain][societe]['member_last_change'] = last_changed

        with open(chemin_fichier, 'w') as f:
            json.dump(mapping, f, indent=4)

    
def getMappingDomaineTags(address):
    chemin_fichier = config.FICHIER_MAPPING_DOMAINE_TAGS
    domain_target = address.split("@")[1]
    if not os.path.exists(chemin_fichier):
        mapping = {}
        members = mailchimpListMembers()
        for member in members :
            domain = member['email_address'].split("@")[1]
            tagList = member['tags']
            if (len(tagList) == 0):
                continue
            if domain not in mapping.keys():
                mapping[domain] = {}
            for tag in tagList:
                if not(tag.startswith(config.PREFIXE_MAPPING_DOMAINE_TAGS)):
                    continue
                if tag not in mapping[domain].keys():
                    d = {'tag' : tag, 'member_last_change' : member['last_changed']}
                    mapping[domain][tag] = d 
                else :
                    if (mapping[domain][tag]['member_last_change'] < member['last_changed']):
                        mapping[domain][tag]['member_last_change'] = member['last_changed']

        with open(chemin_fichier, 'w') as f:
            json.dump(mapping, f, indent=4)

    else :
        with open(chemin_fichier, 'r') as j:
            mapping = json.loads(j.read())

    
    if domain_target in mapping.keys():
        mapping_domain = mapping[domain_target]
        if len(mapping_domain) == 0:
            return []
        mapping_ordered = list(dict(sorted(mapping_domain.items(), key=lambda item: item[1]['member_last_change'], reverse=True)).keys())
        at = activeTagList()
        for tagBD in mapping_ordered : #on retourne le tag le plus récent du cache qui est toujours un tag valide
            if tagBD in at:
                return [tagBD]
    else : 
        return []

def incrementMappingDomaineTags(address, tagList, last_changed):
    lock_incrementMappingDomaineTags = Lock() 
    with lock_incrementMappingDomaineTags:
        chemin_fichier = config.FICHIER_MAPPING_DOMAINE_TAGS
        if not os.path.exists(chemin_fichier):
            return False
        if (len(tagList) == 0):
            return False
        domain = address.split("@")[1]
        with open(chemin_fichier, 'r') as j:
            mapping = json.loads(j.read())
        if domain not in mapping.keys():
            mapping[domain] = {}
        for tag in tagList:
            if not(tag.startswith(config.PREFIXE_MAPPING_DOMAINE_TAGS)):
                continue
            if tag not in mapping[domain].keys():
                d = {'tag' : tag, 'member_last_change' : last_changed}
                mapping[domain][tag] = d
            else :
                if (mapping[domain][tag]['member_last_change'] < last_changed):
                    mapping[domain][tag]['member_last_change'] = last_changed

        with open(chemin_fichier, 'w') as f:
            json.dump(mapping, f, indent=4)

def getMappingUserTags(user_mail_address):
    res = []
    at = activeTagList()
    if user_mail_address in config.MAPPING_USER_TAGS.keys():
        tags = config.MAPPING_USER_TAGS[user_mail_address]
        for tag in tags :
            if tag in at :
                res.append(tag)
    return res

@APP.route('/contact_ms_graph2mailchimp')
def contact_ms_graph2mailchimp():
    if is_session_valid()==False:
        return flask.redirect(url_for('login', redirect='/contact_ms_graph2mailchimp'))
    response = mailchimpLists()
    return flask.render_template('tableau_mailchimp.html',
                                    list_id_api=response['id'],
                                    list_id_web=response['web_id'],
                                    list_name=response['name'],
                                    list_prod_active=list_prod_active(),
                                    loadUrlendpoint = "/contact_ms_graph2mailchimpData",
                                    titre = "Ajout sur Mailchimp des contacts avec lesquels j'ai des intéractions par email",
                                    showDiplayNameColumn = True,
                                    message = "Cet écran affiche tous les contacts avec lesquels vous avez des interaction par email, et qui ne sont pas encore sur Mailchimp.\nPour éditer un contact qui est déjà sur Mailchimp, cliquez sur le menu Mailchimp dans le menu.")


def mailchimpLists():
    chemin_fichier = config.FICHIER_CACHE_LIST_MAILCHIMP
    refresh_cache = False
    if not os.path.exists(chemin_fichier):
        refresh_cache = True
    else :
        with open(chemin_fichier, 'r') as j:
            data = json.loads(j.read())
        borne = datetime.datetime.now() + datetime.timedelta(minutes=config.CACHE_LIST_MAILCHIMP_DELAI_MINUTE)
        borne_format = borne.isoformat()
        if data['last_changed'] < borne_format :
            refresh_cache = True

    if refresh_cache == True:
        try:
          client = MailchimpMarketing.Client()
          client.set_config({
            "api_key": config.MAILCHIMP_API_KEY,
            "server": config.MAILCHIMP_SERVER_PREFIX
          })
          #TODO : si code HTTP retour = 429, attendre une seconde et recommencer
          response = client.lists.get_list(config.MAILCHIMP_LIST_ID)
          APP.logger.debug('Rafraichissement cache listes mailchimp : %s listes', str(len(response)))
        except ApiClientError as error:
          APP.logger.error("Error: {}".format(error.text))
          return False

        d_format = datetime.datetime.now().isoformat()
        data = {'last_changed' : d_format, 'list' : response}
        with open(chemin_fichier, 'w') as f:
            json.dump(data, f, indent=4)

    with open(chemin_fichier, 'r') as j:
        data = json.loads(j.read())

    return data['list']



def getTagList():
    chemin_fichier = config.FICHIER_CACHE_TAGS_MAILCHIMP
    refresh_cache = False
    if not os.path.exists(chemin_fichier):
        refresh_cache = True
    else :
        with open(chemin_fichier, 'r') as j:
            data = json.loads(j.read())
        borne = datetime.datetime.now() + datetime.timedelta(minutes=config.CACHE_TAGS_MAILCHIMP_DELAI_MINUTE)
        borne_format = borne.isoformat()
        if data['last_changed'] < borne_format :
            refresh_cache = True

    if refresh_cache == True:
        try:
            client = MailchimpMarketing.Client()
            client.set_config({
                "api_key": config.MAILCHIMP_API_KEY,
                "server": config.MAILCHIMP_SERVER_PREFIX
            })

            #surcharger la méthode tag_search afin de permettre le passage de count et de remonter la totalité des TAGS mailchimp (qui ne remonte que 10 tags sans cela)
            import types
            funcType = types.MethodType
            client.lists.tag_search_with_http_info = funcType(tag_search_with_http_info_with_page_param, client.lists)

            response = client.lists.tag_search(config.MAILCHIMP_LIST_ID, count=500)

            APP.logger.debug('Rafraichissement cache tags mailchimp : %s tags', str(len(response)))
        except ApiClientError as error:
            print("Error: {}".format(error.text))
            return False
        d_format = datetime.datetime.now().isoformat()
        data = {'last_changed' : d_format, 'tags' : response['tags']}
        with open(chemin_fichier, 'w') as f:
            json.dump(data, f, indent=4)

    with open(chemin_fichier, 'r') as j:
        data = json.loads(j.read())

    return data['tags']

def activeTagList():
    res = []
    for t in getTagList():
        res.append(t['name'])
    return res

@APP.route('/mailchimpArchiveMember', methods=["DELETE"])
def mailchimpArchiveMember():
    if is_session_valid()==False:
        return flask.redirect( url_for('login', redirect='/mailchimpMembersTags'))
    
    try:
        client = MailchimpMarketing.Client()
        client.set_config({
            "api_key": config.MAILCHIMP_API_KEY,
            "server": config.MAILCHIMP_SERVER_PREFIX
        })

        email_address = request.form.getlist('key')[0]
        response = client.lists.delete_list_member(config.MAILCHIMP_LIST_ID, email_address)
        mailchimpArchiveMemberInCache(email_address)
        return "Deleted"
    except ApiClientError as error:
        print("Error: {}".format(error.text))
        return False

def mailchimpArchiveMemberInCache(email_address):
    chemin_fichier = config.FICHIER_CACHE_MEMBRES_MAILCHIMP
    d = datetime.datetime.now() + datetime.timedelta(minutes=config.CACHE_MEMBRES_MAILCHIMP_DELAI_MINUTE_LAST_CHANGED)
    d_format = d.isoformat()
    if not os.path.exists(chemin_fichier):
        pass
    else :
        with open(chemin_fichier, 'r') as j:
            data = json.loads(j.read())
        data['last_changed'] = d_format
        for i in range(len(data['members'])):
            if data['members'][i]['email_address'] == email_address :
                del data['members'][i]
                break
        #TODO : la suppression définive de fiches sur Mailchimp ne remontent pas par API et restent dans le cache.
            #il faut supprimer le cache
            #la bonne pratique est de ne jamais supprimer une fiche définitivement mais d'archiver le contact... mais l'API ne les retourne plus après archivage
            #on peut aussi simplement le passer au statut unsubscribed sur l'IHM Mailchimp... mais dans ce cas il continue à nous être facturé

        lock_cache_members = Lock() 
        with lock_cache_members:
            with open(chemin_fichier, 'w') as f:
                json.dump(data, f, indent=4)


@APP.route('/mailchimpMembersTags')
def mailchimpMembersTags():
    if is_session_valid()==False:
        return flask.redirect( url_for('login', redirect='/mailchimpMembersTags'))
    
    try:
        response = getTagList() 
        return jsonify(response)
    except ApiClientError as error:
        APP.logger.error("Error: {}".format(error.text))
        return False


@MSGRAPH.tokengetter
def get_token():
    """Called by flask_oauthlib.client to retrieve current access token."""
    return (flask.session['access_token'], '')



def tag_search_with_http_info_with_page_param(self, list_id, **kwargs):  # noqa: E501
    import six
    """Search for tags on a list by name.  # noqa: E501
    Search for tags on a list by name. If no name is provided, will return all tags on the list.  # noqa: E501
    This method makes a synchronous HTTP request by default. To make an
    asynchronous HTTP request, please pass async_req=True
    >>> thread = api.tag_search_with_http_info(list_id, async_req=True)
    >>> result = thread.get()
    :param async_req bool
    :param str list_id: The unique ID for the list. (required)
    :param str name: The search query used to filter tags.  The search query will be compared to each tag as a prefix, so all tags that have a name starting with this field will be returned.
    :return: TagSearchResults
             If the method is called asynchronously,
             returns the request thread.
    """

    all_params = ['list_id', 'name']  # noqa: E501
    all_params.append('async_req')
    all_params.append('_return_http_data_only')
    all_params.append('_preload_content')
    all_params.append('_request_timeout')
    all_params.append('offset')#ADU
    all_params.append('count')#ADU

    params = locals()
    for key, val in six.iteritems(params['kwargs']):
        if key not in all_params:
            raise TypeError(
                "Got an unexpected keyword argument '%s'"
                " to method tag_search" % key
            )
        params[key] = val
    del params['kwargs']
    # verify the required parameter 'list_id' is set
    if ('list_id' not in params or
            params['list_id'] is None):
        raise ValueError("Missing the required parameter `list_id` when calling ``")  # noqa: E501

    collection_formats = {}

    path_params = {}
    if 'list_id' in params:
        path_params['list_id'] = params['list_id']  # noqa: E501

    query_params = []
    if 'name' in params:
        query_params.append(('name', params['name']))  # noqa: E501
    if 'count' in params: #ADU
        query_params.append(('count', params['count']))  #ADU
    if 'offset' in params: #ADU
        query_params.append(('offset', params['offset']))  #ADU

    header_params = {}

    form_params = []
    local_var_files = {}

    body_params = None
    # HTTP header `Accept`
    header_params['Accept'] = self.api_client.select_header_accept(
        ['application/json', 'application/problem+json'])  # noqa: E501

    # HTTP header `Content-Type`
    header_params['Content-Type'] = self.api_client.select_header_content_type(  # noqa: E501
        ['application/json'])  # noqa: E501

    # Authentication setting
    auth_settings = ['basicAuth']  # noqa: E501

    return self.api_client.call_api(
        '/lists/{list_id}/tag-search', 'GET',
        path_params,
        query_params,
        header_params,
        body=body_params,
        post_params=form_params,
        files=local_var_files,
        response_type='TagSearchResults',  # noqa: E501
        auth_settings=auth_settings,
        async_req=params.get('async_req'),
        _return_http_data_only=params.get('_return_http_data_only'),
        _preload_content=params.get('_preload_content', True),
        _request_timeout=params.get('_request_timeout'),
        collection_formats=collection_formats)

if __name__ == '__main__':
    import logging
    import sys

    from flask import has_request_context, request
    from flask.logging import default_handler

    class RequestFormatter(logging.Formatter):
        def format(self, record):
            if has_request_context():
                record.url = request.url
                record.remote_addr = request.remote_addr
            else:
                record.url = None
                record.remote_addr = None

            if 'mail' in flask.session.keys():
                record.mail = flask.session['mail']
            else :
                record.mail = None
            if config.MAILCHIMP_LIST_ID :
                record.mailchimpActiveList = config.MAILCHIMP_LIST_ID
            else:
                record.mailchimpActiveList = None

            return super().format(record)

    formatter = RequestFormatter(
        '%(asctime)s user=%(mail)s mailchimpActiveList=%(mailchimpActiveList)s %(remote_addr)s requested %(url)s\n'
        '      > %(levelname)s in %(module)s: %(message)s'
    )
    default_handler.setFormatter(formatter)

    werkzeug_log = logging.getLogger('werkzeug')
    werkzeug_log.setLevel(logging.ERROR)

    root = logging.getLogger()
    root.setLevel(logging.DEBUG)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.DEBUG)
    handler.setFormatter(formatter)
    root.addHandler(handler)

    APP.run(host="0.0.0.0", port=443, debug=not(list_prod_active()), ssl_context=(config.CERTIF_FULLCHAIN_PATH, config.CERTIF_PRIVKEY_PATH))


