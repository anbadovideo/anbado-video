#!/usr/bin/env python
# -*- coding: utf-8 -*-

from socketio.namespace import BaseNamespace
from socketio.mixins import RoomsMixin
from anbadoserver.models import User, Video, Event
from anbadoserver import frogspawn


def get_room_name(video_id):
    return str(video_id)

class SocketIONamespace(BaseNamespace, RoomsMixin):
    def on_enter(self, params):
        self.join(get_room_name(params['video_id']))
        self.video_room = get_room_name(params['video_id'])
        self.emit('enter_complete', None)

        user = User.by_user_id(params['user_id'])
        video = Video.by_video_id(params['video_id'])
        events = video.event_permitted_to(user)

        self.user_id = user.user_id
        self.video_id = video.video_id

        frogspawn.put({
            'type': 'startWatch',
            'video_id': video.video_id,
            'user_id': user.user_id
        })

        for event in events:
            self.emit('event', event.to_json())

    def on_exit(self, params):
        self.leave(self.video_room)
        self.emit('exit_complete', None)

        frogspawn.put({
            'type': 'endWatch',
            'video_id': self.video_id,
            'user_id': self.user_id
        })

    def on_event(self, params):
        # TODO: need code validating parameters.
        if params.get('user_id', -1) == '0':
            return

        user = User.by_user_id(params.get('user_id', -1))
        if user is None:
            return

        video = Video.by_video_id(params.get('video_id', -1))
        if video is None:
            return

        parent = Event.by_event_id(params.get('parent_id', -1))

        event = Event(user, video, params['appeared'], params['disappeared'], params['content'], params['category'], params['coord'], params['size'], params['permission'], parent)

        if not event.save():
            return

        self.emit_to_room(self.video_room, 'event', params)
        self.emit('event_complete', {'transaction_id': params['transaction_id']})

        frogspawn.put({
            'type': 'postEvent',
            'category': params['category'],
            'content': params['content'] if params['category'] == 'text' else 'BINARY_CONTENT',
            'permission': params['permission'],
            'user_id': user.user_id,
            'video_id': video.video_id,
            'event_id': event.event_id,
            'parent_id': parent.parent_id if parent is not None else -1
        })


namespace_def = {
    '': SocketIONamespace
}
