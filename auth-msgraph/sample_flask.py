"""Flask-OAuthlib sample for Microsoft Graph"""
# Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
# See LICENSE in the project root for license information.
import uuid

import flask
from flask import Response
from flask_oauthlib.client import OAuth

import config

APP = flask.Flask(__name__, template_folder='static/templates')
APP.debug = True
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

@APP.route('/login')
def login():
    """Prompt user to authenticate."""
    flask.session['state'] = str(uuid.uuid4())
    return MSGRAPH.authorize(callback=config.REDIRECT_URI, state=flask.session['state'])

@APP.route('/login/authorized')
def authorized():
    """Handler for the application's Redirect Uri."""
    if str(flask.session['state']) != str(flask.request.args['state']):
        raise Exception('state returned to redirect URL does not match!')
    response = MSGRAPH.authorized_response()
    flask.session['access_token'] = response['access_token']
    #return flask.redirect('/graphcall')
    return flask.redirect('/contacts')

@APP.route('/graphcall')
def graphcall():
    """Confirm user authentication by calling Graph and displaying some data."""
    endpoint = 'me'
    headers = {'SdkVersion': 'sample-python-flask',
               'x-client-SKU': 'sample-python-flask',
               'client-request-id': str(uuid.uuid4()),
               'return-client-request-id': 'true'}
    graphdata = MSGRAPH.get(endpoint, headers=headers).data
    return flask.render_template('graphcall.html',
                                 graphdata=graphdata,
                                 endpoint=config.RESOURCE + config.API_VERSION + '/' + endpoint,
                                 sample='Flask-OAuthlib')

@APP.route('/mailchimp')
def mailchimp():

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
    return flask.render_template('tableau_mailchimp.html', objects=res.values())


@APP.route('/contacts')
def contacts():
    s = """{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users('9764dc53-685f-4822-9b4a-6d755bd222b0')/people",
    "@odata.nextLink": "https://graph.microsoft.com/v1.0/me/people?$skip=0",
    "value": [
        {
            "id": "rrOSGqkLTEGANDTqPWBxgw==",
            "displayName": "TOUZE Celine",
            "givenName": null,
            "surname": null,
            "birthday": null,
            "personNotes": null,
            "isFavorite": false,
            "jobTitle": null,
            "companyName": null,
            "yomiCompany": null,
            "department": null,
            "officeLocation": null,
            "profession": null,
            "userPrincipalName": null,
            "imAddress": null,
            "scoredEmailAddresses": [
                {
                    "address": "celine.touze@finances.gouv.fr",
                    "relevanceScore": 6891,
                    "selectionLikelihood": "notSpecified"
                }
            ],
            "phones": [],
            "personType": {
                "class": "Person",
                "subclass": "ImplicitContact"
            }
        },
        {
            "id": "F2XAJ0ZAWUqEu6BRBhPTwA==",
            "displayName": "brice grimault",
            "givenName": null,
            "surname": null,
            "birthday": null,
            "personNotes": null,
            "isFavorite": false,
            "jobTitle": null,
            "companyName": null,
            "yomiCompany": null,
            "department": null,
            "officeLocation": null,
            "profession": null,
            "userPrincipalName": null,
            "imAddress": null,
            "scoredEmailAddresses": [
                {
                    "address": "brice.grimault@finances.gouv.fr",
                    "relevanceScore": 5865,
                    "selectionLikelihood": "notSpecified"
                }
            ],
            "phones": [],
            "personType": {
                "class": "Person",
                "subclass": "ImplicitContact"
            }
        },
        {
            "id": "49ea7959-e8a7-4232-ad87-e969fbe6e067",
            "displayName": "Wolfgang This",
            "givenName": "Wolfgang",
            "surname": "This",
            "birthday": null,
            "personNotes": null,
            "isFavorite": false,
            "jobTitle": null,
            "companyName": null,
            "yomiCompany": null,
            "department": null,
            "officeLocation": null,
            "profession": null,
            "userPrincipalName": "wolfgang.this@tasmane.com",
            "imAddress": "sip:wolfgang.this@tasmane.com",
            "scoredEmailAddresses": [
                {
                    "address": "wolfgang.this@tasmane.com",
                    "relevanceScore": 2085,
                    "selectionLikelihood": "notSpecified"
                }
            ],
            "phones": [],
            "personType": {
                "class": "Person",
                "subclass": "OrganizationUser"
            }
        },
        {
            "id": "CR9aavPoW0e1w4yDQbD7-g==",
            "displayName": "Bernard, Hugues",
            "givenName": null,
            "surname": null,
            "birthday": null,
            "personNotes": null,
            "isFavorite": false,
            "jobTitle": null,
            "companyName": null,
            "yomiCompany": null,
            "department": null,
            "officeLocation": null,
            "profession": null,
            "userPrincipalName": null,
            "imAddress": null,
            "scoredEmailAddresses": [
                {
                    "address": "hugues.bernard@dgfip.finances.gouv.fr",
                    "relevanceScore": 1979,
                    "selectionLikelihood": "notSpecified"
                }
            ],
            "phones": [],
            "personType": {
                "class": "Person",
                "subclass": "ImplicitContact"
            }
        },
        {
            "id": "c0d31432-db0e-4402-98b9-2a934f9defb2",
            "displayName": "Marwa Boujnah",
            "givenName": "Marwa",
            "surname": "Boujnah",
            "birthday": null,
            "personNotes": null,
            "isFavorite": false,
            "jobTitle": null,
            "companyName": null,
            "yomiCompany": null,
            "department": null,
            "officeLocation": null,
            "profession": null,
            "userPrincipalName": "marwa.boujnah@tasmane.com",
            "imAddress": "sip:marwa.boujnah@tasmane.com",
            "scoredEmailAddresses": [
                {
                    "address": "marwa.boujnah@tasmane.com",
                    "relevanceScore": 1568,
                    "selectionLikelihood": "notSpecified"
                }
            ],
            "phones": [],
            "personType": {
                "class": "Person",
                "subclass": "OrganizationUser"
            }
        },
        {
            "id": "ca0cc472-db04-44ca-ae15-43596fd5761a",
            "displayName": "Thibaut Midon",
            "givenName": "Thibaut",
            "surname": "Midon",
            "birthday": null,
            "personNotes": null,
            "isFavorite": false,
            "jobTitle": null,
            "companyName": null,
            "yomiCompany": null,
            "department": null,
            "officeLocation": null,
            "profession": null,
            "userPrincipalName": "thibaut.midon@tasmane.com",
            "imAddress": "sip:thibaut.midon@tasmane.com",
            "scoredEmailAddresses": [
                {
                    "address": "thibaut.midon@tasmane.com",
                    "relevanceScore": 1348,
                    "selectionLikelihood": "notSpecified"
                }
            ],
            "phones": [
                {
                    "type": "mobile",
                    "number": "0689810052"
                },
                {
                    "type": "home",
                    "number": "0681560490"
                }
            ],
            "personType": {
                "class": "Person",
                "subclass": "OrganizationUser"
            }
        },
        {
            "id": "RBPlmpmpC0CqvmiFgkNcJw==",
            "displayName": "christine.le-bourhis@finances.gouv.fr",
            "givenName": null,
            "surname": null,
            "birthday": null,
            "personNotes": null,
            "isFavorite": false,
            "jobTitle": null,
            "companyName": null,
            "yomiCompany": null,
            "department": null,
            "officeLocation": null,
            "profession": null,
            "userPrincipalName": null,
            "imAddress": null,
            "scoredEmailAddresses": [
                {
                    "address": "christine.le-bourhis@finances.gouv.fr",
                    "relevanceScore": 1276,
                    "selectionLikelihood": "notSpecified"
                }
            ],
            "phones": [],
            "personType": {
                "class": "Person",
                "subclass": "ImplicitContact"
            }
        },
        {
            "id": "iO8MRUKxFE_zBzi2J5ISRA==",
            "displayName": "Charles DE RANCOURT",
            "givenName": null,
            "surname": null,
            "birthday": null,
            "personNotes": null,
            "isFavorite": false,
            "jobTitle": null,
            "companyName": null,
            "yomiCompany": null,
            "department": null,
            "officeLocation": null,
            "profession": null,
            "userPrincipalName": null,
            "imAddress": null,
            "scoredEmailAddresses": [
                {
                    "address": "c.de-rancourt@groupeonepoint.com",
                    "relevanceScore": 747,
                    "selectionLikelihood": "notSpecified"
                }
            ],
            "phones": [],
            "personType": {
                "class": "Person",
                "subclass": "ImplicitContact"
            }
        },
        {
            "id": "n3mrAWE0r0SFueI59nTRtw==",
            "displayName": "Nicolas DONGUY",
            "givenName": null,
            "surname": null,
            "birthday": null,
            "personNotes": null,
            "isFavorite": false,
            "jobTitle": null,
            "companyName": null,
            "yomiCompany": null,
            "department": null,
            "officeLocation": null,
            "profession": null,
            "userPrincipalName": null,
            "imAddress": null,
            "scoredEmailAddresses": [
                {
                    "address": "n.donguy@groupeonepoint.com",
                    "relevanceScore": 747,
                    "selectionLikelihood": "notSpecified"
                }
            ],
            "phones": [],
            "personType": {
                "class": "Person",
                "subclass": "ImplicitContact"
            }
        },
        {
            "id": "bKiOV0BHikW_N9kthdVHxg==",
            "displayName": "guillaume.lucas",
            "givenName": null,
            "surname": null,
            "birthday": null,
            "personNotes": null,
            "isFavorite": false,
            "jobTitle": null,
            "companyName": null,
            "yomiCompany": null,
            "department": null,
            "officeLocation": null,
            "profession": null,
            "userPrincipalName": null,
            "imAddress": null,
            "scoredEmailAddresses": [
                {
                    "address": "guillaume.lucas@dgfip.finances.gouv.fr",
                    "relevanceScore": 494,
                    "selectionLikelihood": "notSpecified"
                }
            ],
            "phones": [],
            "personType": {
                "class": "Person",
                "subclass": "ImplicitContact"
            }
        }
    ]
}"""
    endpoint = 'me/people?$top=2500&select=displayName,scoredEmailAddresses'
    #TODO : gérer la pagination au delà de 2500 objets retournés
    headers = {'SdkVersion': 'sample-python-flask',
               'x-client-SKU': 'sample-python-flask',
               'client-request-id': str(uuid.uuid4()),
               'return-client-request-id': 'true'}
    graphdata = MSGRAPH.get(endpoint, headers=headers).data

    import json
    #contactList = json.loads(s)["value"]
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
    logging.basicConfig(filename='error.log',level=logging.DEBUG)
    #APP.run(host="0.0.0.0", port=80, debug=False)
    APP.run(host="0.0.0.0", port=443, debug=True, ssl_context=(config.CERTIF_FULLCHAIN_PATH, config.CERTIF_PRIVKEY_PATH))
