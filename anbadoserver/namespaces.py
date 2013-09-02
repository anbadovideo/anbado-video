#!/usr/bin/env python
# -*- coding: utf-8 -*-

from socketio.namespace import BaseNamespace
from socketio.mixins import RoomsMixin
from gevent import sleep
from anbadoserver import app


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
        import copy, random

        app.logger.info('require event raised')

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

        app.logger.info('post event raised')

        data = {
            'transaction_id': param['transaction_id'],
            'success': True,
            'event_id': random.randint(1, 65535)
        }

        self.emit('post_event_response', data)

    def view_complete(self, param):
        app.logger.info('view_complete raised')

    def recv_disconnect(self):
        app.logger.info('disconnect raised')

        self.disconnect(silent=True)


namespace_def = {
    '/sample/video': SampleVideoNamespace,
    '/sample': SampleNamespace
}
