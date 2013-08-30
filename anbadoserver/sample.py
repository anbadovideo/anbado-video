#!/usr/bin/env python

from gevent import (
    monkey,
    sleep
    )

monkey.patch_all()
from socketio import socketio_manage
from socketio.namespace import BaseNamespace
from socketio.mixins import RoomsMixin
import os
import random


def log(string):
    import datetime

    print datetime.datetime.now(), string


class SampleNamespace(BaseNamespace):
    def on_sample(self, data):
        print('sample event raised! data: ' + str(data))
        self.emit('return', data)


class SampleVideoNamespace(BaseNamespace, RoomsMixin):
    video = {
        'provider': 'youtube',
        'provider_vid': 'aY_iYRlty9I',
        'timeline_weight': []
    }

    def make_room_name(self, provider, provider_vid):
        return provider + provider_vid

    def initialize(self):
        pass

    def on_require(self, param):
        import copy

        log('require event raised')

        if len(self.video['timeline_weight']) == 0:
            for i in range(257):
                self.video['timeline_weight'].append(random.randint(0, 20))

        data = copy.deepcopy(self.video)
        data['success'] = True
        data['transaction_id'] = param['transaction_id']

        self.join(self.make_room_name(self.video['provider'], self.video['provider_vid']))
        self.emit('require_response', data)

        def send_event():
            import random

            while True:
                event = {
                    'event_id': random.randint(0, 1048576),
                    'appeared': random.randint(0, 257),
                    'type': 1,
                    'content': 'test',
                    'user_id': random.randint(0, 65535),
                    'coord': (
                        random.randint(0, 1000),
                        random.randint(0, 1000),
                        random.randint(0, 1000),
                        random.randint(0, 1000)
                    ),
                    'parent_id': -1
                }
                event['disappeared'] = random.randint(event['appeared'], 257)
                self.emit("event_appeared", event)
                sleep(random.randint(2, 4))

        self.spawn(send_event)

    def on_post_event(self, param):
        import random

        log('post event raised')

        data = {
            'transaction_id': param['transaction_id'],
            'success': True,
            'event_id': random.randint(1, 65535)
        }

        self.emit('post_event_response', data)

    def view_complete(self, param):
        log('view_complete raised')

    def recv_disconnect(self):
        log('disconnect raised')

        self.disconnect(silent=True)


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
            path = path.strip('socket.io')
            namespace_def = {
                '/socket.io/v1/sample': SampleNamespace,
                '/socket.io/v1/video': SampleVideoNamespace
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
