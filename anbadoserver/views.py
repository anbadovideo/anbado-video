#!/usr/bin/env python
# -*- coding: utf-8 -*-

from socketio import socketio_manage
from flask import request, Response, render_template

from anbadoserver import app
import anbadoserver.api.http # for load http api
from anbadoserver.api.realtime import namespace_def


@app.route('/socket.io/<path:path>')
def handle_socketio(path):
    try:
        socketio_manage(request.environ, namespace_def, request)
    except:
        app.logger.error("Exception while handling socketio connection.", exc_info=True)

    return Response()


# handlers for test
@app.route('/sample/')
def view_sample():
    return render_template('index.html')


@app.route('/sample/api-test/realtime')
def view_realtime_api_test_sample():
    return render_template('realtime-api-test.html')


@app.route('/sample/api-test/rest')
def vide_rest_api_test_sample():
    return render_template(('rest-api-test.html'))


@app.route('/sample/blob-test')
def view_blob_socket_test():
    return render_template('socket-blob-test.html')
