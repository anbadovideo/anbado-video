#!/usr/bin/env python
# -*- coding: utf-8 -*-

from socketio import socketio_manage
from flask import (
    request,
    Response,
    render_template
    )

from anbadoserver import app
from anbadoserver.namespaces import namespace_def


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
