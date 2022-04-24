import uuid
import time
import datetime

import flask
from flask import Response
from flask import request, redirect
from flask import url_for
from flask_oauthlib.client import OAuth
from flask_session import Session
#TODO : pour une meilleure sécurité, passer à une session côté server
from flask import jsonify

import config


import mailchimp_marketing as MailchimpMarketing
from mailchimp_marketing.api_client import ApiClientError
import json
import hashlib

import os.path


#date_jour = datetime.date.today().isoformat()


APP = flask.Flask(__name__, template_folder='static/templates')
APP.secret_key = config.APP_SECRET_KEY
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
    return flask.render_template('homepage.html', sample='Flask-OAuthlib')


@APP.route('/about')
def about():
    return flask.render_template('about.html')


def is_session_valid():
    print("Test de la session courante", time.time() >= flask.session['token_expires_at'], time.ctime(time.time()), time.ctime(flask.session['token_expires_at']))
    if ('access_token' not in flask.session.keys()) or (not flask.session['access_token']) or (time.time() >= flask.session['token_expires_at']):
        print("SESSION INVALIDE")
        flask.session={}
        return False
    return True

@APP.route('/login')
def login():
    """Prompt user to authenticate."""
    flask.session['state'] = str(uuid.uuid4())
    flask.session['redirect_target'] = request.args.get('redirect')
    return MSGRAPH.authorize(callback=config.REDIRECT_URI, state=flask.session['state'])

@APP.route(config.REDIRECT_PATH)
def authorized():
    """Handler for the application's Redirect Uri."""
    if str(flask.session['state']) != str(flask.request.args['state']):
        raise Exception('state returned to redirect URL does not match!')
    response = MSGRAPH.authorized_response()
    print("MSGRAPH auth response : ", response)
    flask.session['access_token'] = response['access_token']
    expire_date =  time.time() + int(response['expires_in'])
    flask.session['token_expires_at'] = expire_date
    print ("SESSSION EXPIRES AT", flask.session['token_expires_at'], time.ctime(flask.session['token_expires_at']), int(response['expires_in']))


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
            try:
                l = mail["address"].split("@")[0].split('.')
                computed_fname = l[0].title()
                if (len(l) > 1):
                    computed_lname = '.'.join(l[1:]).upper()
            finally:
                print("Erreur d'extraction du prénom et du nom pour cette adresse email : "+mail["address"])

            merge_fields = {'FNAME' : computed_fname, 'LNAME' : computed_lname, 'SOCIETE':getMappingDomaineSocietes(mail["address"])}
            res.append({'displayName': contact['displayName'], 'email_address' : mail["address"], 'status' : 'new', 'tags':[], 'merge_fields' : merge_fields})
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
            if (last_change == None):
                response = client.lists.get_list_members_info(config.MAILCHIMP_LIST_ID, offset=offset, count=config.MAILCHIMP_PAGE_SIZE)
            else :
                response = client.lists.get_list_members_info(config.MAILCHIMP_LIST_ID, offset=offset, count=config.MAILCHIMP_PAGE_SIZE, since_last_changed=last_change)
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
            #il faut supprimer le cache (ou redémarrer la VM puisque le cache est dans /tmp pour qu'il se rafraichisse
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
        response["tags"] = sorted(form['tags'])

        return jsonify(response)

    except ApiClientError as error:
        print("Error: {}".format(error.text))
        error_dic = json.loads(error.text)
        return jsonify(error.text), error_dic["status"]
    return Response(jsonify("Erreur"), 500)


@APP.route('/mailchimp')
def mailchimp():
    if is_session_valid()==False:
        return flask.redirect( url_for('login', redirect='/mailchimp'))
    response = mailchimpLists()
    return flask.render_template('tableau_mailchimp.html', 
                                    list_id_api=response['id'],
                                    list_id_web=response['web_id'], 
                                    list_name=response['name'], 
                                    loadUrlendpoint = "/mailchimpData",
                                    titre = "Liste des contacts Mailchimp",
                                    showDiplayNameColumn = False,
                                    message = "")


def getMappingDomaineSocietes(address):
    chemin_fichier = config.FICHIER_MAPPING_DOMAINE_SOCIETES
    domain = address.split("@")[1]
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

    
    if domain in mapping.keys():
        mapping_domain = mapping[domain]
        mapping_ordered = list(dict(sorted(mapping_domain.items(), key=lambda item: item[1]['member_last_change'], reverse=True)).keys())
        #mapping_ordered = list(mapping_domain.keys())
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



"""
@APP.route('/ms_graph_contact2csv')
def ms_graph_contact2csv():
    if is_session_valid()==False:
        return flask.redirect( url_for('login', redirect='/contacts'))
    endpoint = 'me/people?$top=2500&select=displayName,scoredEmailAddresses'
    #TODO : gérer la pagination au delà de 2500 objets retournés
    headers = {'SdkVersion': 'sample-python-flask',
               'x-client-SKU': 'sample-python-flask',
               'client-request-id': str(uuid.uuid4()),
               'return-client-request-id': 'true'}
    resp = MSGRAPH.get(endpoint, headers=headers)
    if (resp.status != 200):
        return "ERREUR : "+str(resp.status)

    graphdata = resp.data

    contactList = graphdata["value"]
    res = [["Nom","Adresse","IntegrationMailChimp"]]
    for contact in contactList:
        dn = ""
        if contact['displayName'] != None :
            dn = contact['displayName']
        for mail in contact["scoredEmailAddresses"]:
            res.append([dn.replace(';','-'),mail["address"],"oui"])
    csv = ""
    for row in res :
        csv += ';'.join(row)
        csv += '\n'
    return Response(
        csv,
        mimetype="text/csv",
        headers={"Content-disposition":
                 "attachment; mesContacts.csv"})
"""


@MSGRAPH.tokengetter
def get_token():
    """Called by flask_oauthlib.client to retrieve current access token."""
    return (flask.session.get('access_token'), '')

if __name__ == '__main__':
    import logging
    import sys

    werkzeug_log = logging.getLogger('werkzeug')
    werkzeug_log.setLevel(logging.ERROR)

    root = logging.getLogger()
    root.setLevel(logging.DEBUG)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    root.addHandler(handler)
    #logging.basicConfig(filename='error.log',level=logging.DEBUG)
    #APP.run(host="0.0.0.0", port=80, debug=False)
    APP.run(host="0.0.0.0", port=443, debug=True, ssl_context=(config.CERTIF_FULLCHAIN_PATH, config.CERTIF_PRIVKEY_PATH))


