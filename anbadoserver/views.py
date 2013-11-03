#!/usr/bin/env python
# -*- coding: utf-8 -*-

from socketio import socketio_manage
from flask import request, Response, render_template

from anbadoserver import app
import anbadoserver.api.http # for load http api
from anbadoserver.api.realtime import namespace_def
from anbadoserver.decorators import crossdomain


@app.route('/socket.io/<path:path>')
@crossdomain(origin='*')
def handle_socketio(path):
    try:
        socketio_manage(request.environ, namespace_def, request)
    except:
        app.logger.error("Exception while handling socketio connection.", exc_info=True)

    return Response()


# handlers for test
@app.route('/examples/<path:name>')
def example(name):
    return render_template('examples/' + name + '.html')
