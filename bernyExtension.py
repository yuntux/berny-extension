import uuid
import time
import datetime

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
        print("Test de la flask.session courante",  d, "*", flask.session['token_expires_at'])
        #print("Test de la flask.session courante", d > flask.session['token_expires_at'], d, ">", flask.session['token_expires_at'])
    else : 
        print("'token_expires_at' non defini")
    if ('access_token' not in flask.session.keys()) or (not flask.session['access_token']) or (d > flask.session['token_expires_at']):
        print("SESSION INVALIDE :", flask.session)
        if ('token_expires_at' in flask.session.keys()  and 'refresh_token' in flask.session.keys() and d > flask.session['token_expires_at']):
            print('La flask.session va être rafraichie')
            response = refresh_credentials(flask.session['refresh_token'])
            if 'access_token' not in response.keys():
                print("Impossible de rafraichir la flask.session à partir du refresh_token")
                empty_session()
                return False
            initSessionTokens(response)
            print('Session rafraichie')
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
    print("MSGRAPH auth response : ", response)
    flask.session['access_token'] = response['access_token']
    print("New access token : ", flask.session['access_token'])
    #response['expires_in'] = 5
    d = datetime.datetime.now() + datetime.timedelta(seconds=response['expires_in'])
    expire_date = d.isoformat()
    flask.session['token_expires_at'] = expire_date
    if 'refresh_token' in response.keys(): #MS ne retourne pas de refresh_token si offline_access n'est pas intégré au scope
        flask.session['refresh_token'] = response['refresh_token']
    print ("SESSION EXPIRES AT", flask.session['token_expires_at'], int(response['expires_in']))



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
        flask.session={}
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
    mailchimpMembersMails = [d['email_address'] for d in members]

    ########## RECUPERER LES CONTACTS MS GRAPH
    contacts = []
    offset = 0
    while (True) :
        print("========= Appl contacts MSGRAPH =======", flask.session['mail'], flask.session['access_token'])
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
    print("=== REPONSE MS GRAPH ===", flask.session['mail'], flask.session['access_token'], len(contacts), contacts)

    ########## STRUCTURER LES CONTACTS MICROSOFT AU FORMAT CIBLE
    res = []
    for contact in contacts:
        for mail in contact["scoredEmailAddresses"]:
            if config.DOMAIN_EXCLUSION in mail["address"] :
                continue
            if mail["address"] in mailchimpMembersMails : #ne retourner que les contacts Outlook qui ne sont pas encore dans mailchimp
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
            res.append({'displayName': contact['displayName'], 'email_address' : mail["address"], 'last_changed':'2000-01-01', 'status' : 'new', 'tags':[], 'merge_fields' : merge_fields})
    print("RETOUR /contact_ms_graph2mailchimpData ", flask.session['mail'], res)
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
          while (True) :
            #FL = "email_address,status,merge_fields,last_changed"
            if (last_change == None):
                response = client.lists.get_list_members_info(config.MAILCHIMP_LIST_ID, offset=offset, count=config.MAILCHIMP_PAGE_SIZE)
            else :
                response = client.lists.get_list_members_info(config.MAILCHIMP_LIST_ID, offset=offset, count=config.MAILCHIMP_PAGE_SIZE, since_last_changed=last_change)
            #print(response)
            #TODO : si code HTTP retour = 429, attendre une seconde et recommencer
            members.extend(response['members'])
            if (len(response['members']) < config.MAILCHIMP_PAGE_SIZE):
                break
            offset = offset + config.MAILCHIMP_PAGE_SIZE 

          for member in members:
              tags = [d['name'] for d in member['tags']]
              member["tags"] = sorted(tags)
              del member['_links']
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
        data['last_changed'] = d_format
        changed_members = appelsApiMembres(data["last_changed"])
        print('Nombre de membres ayant changé depuis '+data['last_changed']+" : "+str(len(changed_members)))
        print(str(changed_members))
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

        with open(chemin_fichier, 'w') as f:
            json.dump(data, f, indent=4)

    return data['members']

@APP.route('/mailchimpAddUpdate', methods=['POST','PUT'])
def mailchimpAddUpdate():
    if is_session_valid()==False:
        return flask.redirect( url_for('login', redirect='/'))

    form = json.loads(request.form.getlist('values')[0])
    print("mailchimpAddUpdate / form =",form)
    if 'email_address' in form.keys() :
        email_address =  form['email_address']
    else :
        email_address = request.form.getlist('key')[0]

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
        if ('status' not in form.keys()) or (form['status'] in ["new", ""]):
            d['status'] = "subscribed"
        else :
            d['status'] = form['status']
        if ('merge_fields' in form.keys()):
            d['merge_fields'] = form['merge_fields']
        print(flask.session['mail'] + " ===> client.lists.set_list_member", config.MAILCHIMP_LIST_ID, h, d)
        response = client.lists.set_list_member(config.MAILCHIMP_LIST_ID, h, d)
        #TODO : si code HTTP retour = 429, attendre une seconde et recommencer
        print(flask.session['mail'] + " ===> Reponse de Mailchimp", response)


        #MISE A JOUR DES TAGS
        t = []
        if ('tags' not in form.keys()):
            form['tags'] = []
        response_tags = getTagList()

        for tag in response_tags:
            if tag['name'] in form['tags']:
                t.append(dict({"name": tag['name'], "status": "active"}))
            else :
                t.append(dict({"name": tag['name'], "status": "inactive"}))

        print(flask.session['mail'], " ===> client.lists.update_list_member_tags", config.MAILCHIMP_LIST_ID, h, t)
        response_update_list_member_tags = client.lists.update_list_member_tags(config.MAILCHIMP_LIST_ID, h, {'tags':t})
        #TODO : si code HTTP retour = 429, attendre une seconde et recommencer
        print(flask.session['mail'] + " Réponse de Mailchimp :", response_update_list_member_tags)

        incrementMappingDomaineSocietes(response["email_address"], response['merge_fields']['SOCIETE'], response['last_changed'])
        del(response['_links'])
        response["tags"] = sorted(form['tags'])

        return jsonify(response)

    except ApiClientError as error:
        print("Error: {}".format(error.text))
        error_dic = json.loads(error.text)
        return jsonify(error.text), error_dic["status"]
    return Response(jsonify("Erreur"), 500)


def list_prod_active(id_liste_active):
    is_prod = False
    if id_liste_active == config.MAILCHIMP_LIST_ID_PRODUCTION:
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
                                    list_prod_active=list_prod_active(response['id']),
                                    loadUrlendpoint = "/mailchimpData",
                                    titre = "Liste des contacts Mailchimp",
                                    showDiplayNameColumn = False,
                                    message = "")

@APP.route('/maj_cache')
def majCache():
    if is_session_valid()==False:
        return flask.redirect( url_for('login', redirect='/maj_cache'))

    if os.path.exists(config.FICHIER_MAPPING_DOMAINE_SOCIETES):
        os.remove(config.FICHIER_MAPPING_DOMAINE_SOCIETES)

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

    

@APP.route('/contact_ms_graph2mailchimp')
def contact_ms_graph2mailchimp():
    if is_session_valid()==False:
        return flask.redirect(url_for('login', redirect='/contact_ms_graph2mailchimp'))
    response = mailchimpLists()
    return flask.render_template('tableau_mailchimp.html',
                                    list_id_api=response['id'],
                                    list_id_web=response['web_id'],
                                    list_name=response['name'],
                                    list_prod_active=list_prod_active(response['id']),
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
          print('Rafraichissement cache liste mailchimp:',response)
        except ApiClientError as error:
          print("Error: {}".format(error.text))
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
            response = client.lists.tag_search(config.MAILCHIMP_LIST_ID)
            print('Rafraichissement cache tags mailchimp:',response)
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




@APP.route('/mailchimpMembersTags')
def mailchimpMembersTags():
    if is_session_valid()==False:
        return flask.redirect( url_for('login', redirect='/mailchimpMembersTags'))
    
    try:
        response = getTagList() 
        return jsonify(response)
    except ApiClientError as error:
        print("Error: {}".format(error.text))
        return False


@MSGRAPH.tokengetter
def get_token():
    """Called by flask_oauthlib.client to retrieve current access token."""
    #return (flask.session.get('access_token'), '')
    if 'mail' in flask.session.keys():
        print("===== get_token =====", flask.session['mail'], flask.session['access_token'])
    return (flask.session['access_token'], '')

if __name__ == '__main__':
    import logging
    import sys

    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    werkzeug_log = logging.getLogger('werkzeug')
    werkzeug_log.setLevel(logging.ERROR)

    root = logging.getLogger()
    root.setLevel(logging.DEBUG)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.DEBUG)
    handler.setFormatter(formatter)
    root.addHandler(handler)

    APP.run(host="0.0.0.0", port=443, debug=True, ssl_context=(config.CERTIF_FULLCHAIN_PATH, config.CERTIF_PRIVKEY_PATH))


