#!/usr/bin/env python

from gevent import monkey

monkey.patch_all()

from socketio import socketio_manage
from socketio.namespace import BaseNamespace

import os


class SampleNamespace(BaseNamespace):
    def on_sample(self, data):
        print('sample event raised! data: ' + str(data))
        self.emit('return', data)


class Application(object):
    def __init__(self):
        self.request = {}

    def not_found(self, start_response):
        start_response('404 Not Found', [])
        return ['<h1>Not Found</h1>']

    def __call__(self, environ, start_response):
        path = environ['PATH_INFO'].strip('/')
        content_type = ''

        if not path:
            path = 'sample/index.html'

        print(path)

        if path.endswith('.js'):
            content_type = 'text/javascript'
        elif path.endswith('.swf'):
            content_type = 'application/x-shockwave-flash'
        elif path.endswith('.html'):
            content_type = 'text/html'
        elif path.startswith('socket.io'):
            namespace_def = {
                '': SampleNamespace
            }

            socketio_manage(environ, namespace_def, self.request)
            return

        try:
            path = os.path.join(os.path.dirname(__file__), path)
            data = open(path).read()
        except Exception:
            return self.not_found(start_response)

        start_response('200 OK', [('Content-Type', content_type)])
        return [data]
