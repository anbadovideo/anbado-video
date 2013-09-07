#!/usr/bin/env python
# -*- coding: utf-8 -*-

from socketio import socketio_manage
from flask import (
    request,
    Response,
    render_template
    )

from anbadoserver import app
from anbadoserver.api.realtime import namespace_def
from anbadoserver.api.http import (
    UserAPI,
    VideoAPI,
    FriendshipAPI
    )


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


user_view = UserAPI.as_view('user_api')
video_view = VideoAPI.as_view('video_api')
friendship_view = FriendshipAPI.as_view('friendship_api')

app.add_url_rule('/user', view_func=user_view, methods=('POST', ))
app.add_url_rule('/user/<int:user_id>', view_func=user_view, methods=('GET', 'PUT'))

app.add_url_rule('/video', view_func=video_view, methods=('POST', ))
app.add_url_rule('/video/<int:video_id>', view_func=video_view, methods=('GET', 'PUT'))

app.add_url_rule('/friendship/<int:user_id>', view_func=friendship_view, methods=('GET', ))
app.add_url_rule('/friendship/<int:userA_id>/<int:userB_id>', view_func=friendship_view, methods=('POST', 'DELETE'))
