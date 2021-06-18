"""Flask-OAuthlib sample for Microsoft Graph"""
# Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
# See LICENSE in the project root for license information.
import uuid
import time

import flask
from flask import Response
from flask import request
from flask import url_for
from flask_oauthlib.client import OAuth
from flask_session import Session

import config

APP = flask.Flask(__name__, template_folder='static/templates')
APP.debug = True
APP.config['SESSION_TYPE'] = 'filesystem'
APP.secret_key = config.APP_SECRET_KEY
OAUTH = OAuth(APP)
MSGRAPH = OAUTH.remote_app(
    'microsoft', consumer_key=config.CLIENT_ID, consumer_secret=config.CLIENT_SECRET,
    request_token_params={'scope': config.SCOPES},
    base_url=config.RESOURCE + config.API_VERSION + '/',
    request_token_url=None, access_token_method='POST',
    access_token_url=config.AUTHORITY_URL + config.TOKEN_ENDPOINT,
    authorize_url=config.AUTHORITY_URL + config.AUTH_ENDPOINT)


def is_session_valid():
    if ('access_token' not in flask.session.keys()) or (not flask.session['access_token']) or (time.time() >= flask.session['token_expires_at']):
        flask.session={}
        return False
    return True

@APP.route('/')
def homepage():
    """Render the home page."""
    return flask.render_template('homepage.html', sample='Flask-OAuthlib')

@APP.route('/about')
def about():
    return flask.render_template('about.html')

@APP.route('/login')
def login():
    """Prompt user to authenticate."""
    flask.session['state'] = str(uuid.uuid4())
    flask.session['redirect_target'] = request.args.get('redirect')
    #TOOD : il serait plus propre de passer la cibel de redirection dans une path du redirect URI encodé en HTML path
    return MSGRAPH.authorize(callback=config.REDIRECT_URI, state=flask.session['state'])

@APP.route('/login/authorized')
def authorized():
    """Handler for the application's Redirect Uri."""
    if str(flask.session['state']) != str(flask.request.args['state']):
        raise Exception('state returned to redirect URL does not match!')
    response = MSGRAPH.authorized_response()
    flask.session['access_token'] = response['access_token']
    flask.session['token_expires_at'] = time.time() + int(response['expires_in'])
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
        return flask.redirect( url_for('login', redirect='/mailchimp'))
    
    ########## RECUPERER LES CONTACTS MS GRAPH
    contacts = []
    offset = 0
    while (True) :
        endpoint = 'me/people?$top='+str(config.MSGRAPH_PAGE_SIZE)+'&select=displayName,scoredEmailAddresses&skip='+str(offset)
        print(endpoint)
        headers = {'SdkVersion': 'sample-python-flask',
                   'x-client-SKU': 'sample-python-flask',
                   'client-request-id': str(uuid.uuid4()),
                   'return-client-request-id': 'true'}
        graphdata = MSGRAPH.get(endpoint, headers=headers).data
        #print(len(graphdata))
        #print(graphdata)
        contacts.extend(graphdata["value"])
        #print("comp")
        #print(len(contacts))
        #print("skip")
        #print(offset)
        #print("top")
        #print(config.MSGRAPH_PAGE_SIZE)
        #print(len(graphdata["value"]))
        if (len(graphdata["value"]) < config.MSGRAPH_PAGE_SIZE):
            break
        offset = offset + config.MSGRAPH_PAGE_SIZE 
        #print("new_skip")
        #print(offset)

    ########## STRUCTURER LES CONTACTS AU FORMAT CIBLE
    res = {}
    for contact in contacts:
        dn = ""
        if contact['displayName'] != None :
            dn = contact['displayName']
        for mail in contact["scoredEmailAddresses"]:
            res[mail["address"]] = {'displayName': contact['displayName'], 'mail' : mail["address"], 'status' : 'new', 'tags':[]}


    ########## RECUPERER LES CONTACTS MAILCHIMP
    import mailchimp_marketing as MailchimpMarketing
    from mailchimp_marketing.api_client import ApiClientError

    try:
      client = MailchimpMarketing.Client()
      client.set_config({
        "api_key": config.MAILCHIMP_API_KEY,
        "server": config.MAILCHIMP_SERVER_PREFIX
      })

      #res_l = client.lists.get_all_lists()
      #response = client.lists.get_list(config.MAILCHIMP_LIST_ID)
      members = []
      offset = 0
      #response = client.lists.get_list_members_info(config.MAILCHIMP_LIST_ID, offset=offset, count=config.MAILCHIMP_PAGE_SIZE)
      #members.extend(response['members'])
      while (True) :
        response = client.lists.get_list_members_info(config.MAILCHIMP_LIST_ID, offset=offset, count=config.MAILCHIMP_PAGE_SIZE)
        members.extend(response['members'])
        if (len(response['members']) < config.MAILCHIMP_PAGE_SIZE):
            break
        offset = offset + config.MAILCHIMP_PAGE_SIZE 
      
    except ApiClientError as error:
      print("Error: {}".format(error.text))

    ########## INTEGRER LES DONNEES MAILCHIMP DANS LES CONTACTS AU FORMAT PIVOT
    print ("compteur")
    print (str(len(members)))
    #print(members)
    for member in members:
      mail = member['email_address']
      #print (mail)
      if (mail in res.keys()):
          #print ("ok===============")
          res[mail]["tags"] = member['tags']
          res[mail]["status"] = member['status']
      else :
          #print ("addresse exclued : " + mail)
          pass


    #from flask_table import Table, Col
    #class ItemTable(Table):
    #    displayName = Col('Nom')
    #    mail = Col('Mail')
    #    status = Col('Statut')
    #table = ItemTable(res.items())
    #return res
    from flask import jsonify
    return jsonify(list(res.values()))

@APP.route('/mailchimp')
def mailchimp():
    #return flask.render_template('tableau_mailchimp.html', objects=res.values())
    return flask.render_template('tableau_mailchimp.html')

@APP.route('/contacts')
def contacts():
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



@MSGRAPH.tokengetter
def get_token():
    """Called by flask_oauthlib.client to retrieve current access token."""
    return (flask.session.get('access_token'), '')

if __name__ == '__main__':
    import logging
    #logging.basicConfig(filename='error.log',level=logging.DEBUG)
    #APP.run(host="0.0.0.0", port=80, debug=False)
    APP.run(host="0.0.0.0", port=443, debug=True, ssl_context=(config.CERTIF_FULLCHAIN_PATH, config.CERTIF_PRIVKEY_PATH))
