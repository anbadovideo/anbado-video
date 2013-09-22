#!/usr/bin/env python
# -*- coding: utf-8 -*-

from socketio.namespace import BaseNamespace
from socketio.mixins import RoomsMixin
from anbadoserver.models import User, Video, Event


def get_room_name(video_id):
    return str(video_id)

class SocketIONamespace(BaseNamespace, RoomsMixin):
    def on_enter(self, params):
        self.join(get_room_name(params['video_id']))
        self.video_id = get_room_name(params['video_id'])
        self.emit('enter_complete', None)

        user = User.by_user_id(params['user_id'])
        video = Video.by_video_id(params['video_id'])
        events = video.event_permitted_to(user)

        for event in events:
            self.emit('event', event.to_json())

    def on_exit(self, params):
        self.leave(self.video_id)
        self.emit('exit_complete', None)

    def on_event(self, params):
        # TODO: need code validating parameters.
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

        self.emit_to_room(self.video_id, 'event', params)
        self.emit('event_complete', {'transaction_id': params['transaction_id']})


namespace_def = {
    '': SocketIONamespace
}
