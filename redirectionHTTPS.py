"""Flask-OAuthlib sample for Microsoft Graph"""
# Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
# See LICENSE in the project root for license information.
import flask
from flask import Response
from flask import request, redirect
from flask import url_for

HTTPS_REDIRECTOR_APP = flask.Flask(__name__, template_folder='static/templates')
@HTTPS_REDIRECTOR_APP.before_request
def before_request():
    if not request.is_secure:
        url = request.url.replace('http://', 'https://', 1)
        code = 302
        return redirect(url, code=code)

if __name__ == '__main__':
    HTTPS_REDIRECTOR_APP.run(host="0.0.0.0", port=80, debug=True)


