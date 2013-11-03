#!/usr/bin/env python
# -*- coding: utf-8 -*-

from datetime import datetime

from sqlalchemy import or_, and_, func
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.exc import SQLAlchemyError

from anbadoserver import db
from anbadoserver.mixin import JsonifiedModel


user_user_association_table = db.Table(
    'user_user_association_table', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('users.user_id'), primary_key=True),
    db.Column('friend_id', db.Integer, db.ForeignKey('users.user_id'), primary_key=True)
)


class User(db.Model, JsonifiedModel):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80, convert_unicode=True))
    _profile_image = db.Column(db.LargeBinary())
    _videos = db.relationship('Video', uselist=True, lazy='dynamic')
    _events = db.relationship('Event', uselist=True, lazy='dynamic')
    _friends = db.relationship('User', uselist=True, lazy='dynamic',
                               secondary=user_user_association_table,
                               primaryjoin=(user_id == user_user_association_table.c.user_id),
                               secondaryjoin=(user_id == user_user_association_table.c.friend_id),
    )

    def __init__(self, name, profile_image, user_id=-1):
        self.name = name
        self.profile_image = profile_image

        if user_id != -1:
            self.user_id = user_id

    def __repr__(self):
        return '<User {0}> {1} {2}'.format(self.user_id, self.name, self.profile_image)

    @hybrid_property
    def profile_image(self):
        return self._profile_image.decode('utf-8')

    @profile_image.setter
    def profile_image(self, value):
        if isinstance(value, unicode):
            self._profile_image = value.encode('utf-8')
        else:
            self._profile_image = value

    @classmethod
    def by_user_id(cls, user_id):
        try:
            return db.session.query(User).filter(User.user_id == user_id).first()
        except SQLAlchemyError:
            return None

    def save(self, commit=True):
        try:
            db.session.add(self)
            if commit:
                db.session.commit()
        except SQLAlchemyError:
            return False

        return True


class Video(db.Model, JsonifiedModel):
    __tablename__ = 'videos'

    video_id = db.Column(db.Integer, primary_key=True)
    provider = db.Column(db.Enum('youtube', 'vimeo', 'anbado', name='video_provider'))
    provider_vid = db.Column(db.String(2048, convert_unicode=True))

    title = db.Column(db.String(2048, convert_unicode=True))
    length = db.Column(db.Integer, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    _user = db.relationship('User', uselist=False)

    _events = db.relationship('Event', uselist=True, lazy='dynamic')

    def __init__(self, provider, provider_vid, title, length, user, video_id=-1):
        self.provider = provider
        self.provider_vid = provider_vid
        self.title = title
        self.length = length
        self._user = user

        if video_id != -1:
            self.video_id = video_id

    def __repr__(self):
        return '<Video {0}> provider: {1}, vid: {2}'.format(self.video_id, self.provider, self.provider_vid)

    @classmethod
    def by_video_id(cls, video_id):
        try:
            return db.session.query(Video).filter(Video.video_id == video_id).first()
        except SQLAlchemyError:
            return None

    def event_permitted_to(self, user):
        if user is None:
            user_id = -1
        else:
            user_id = user.user_id

        try:
            results = self._events.join(Event._user).filter(
                or_(
                    Event.permission == 'public',
                    and_(
                        Event.permission == 'protected',
                        or_(
                            User._friends.any(User.user_id == user_id),
                            Event.user_id == user_id
                        )
                    )
                )
            ).all()

            depth2_events = self._events.filter(Event.permission == 'inherited').all()
            for event in depth2_events:
                if event.user_id == user.user_id or event._parent.permission == 'public' or (
                            event._parent.permission == 'protected' and event._parent._user.friends.exists(user)):
                    results.append(event)

            return results
        except SQLAlchemyError:
            return []

    @hybrid_property
    def timeline_chart(self):
        good_events = db.session.query(
            func.count(Event.event_id).label('count'), Event.appeared
        ).filter(Event.category == 'good').group_by(Event.appeared).all()
        bad_events = db.session.query(
            func.count(Event.event_id).label('count'), Event.appeared
        ).filter(Event.category == 'bad').group_by(Event.appeared).all()

        results = {}

        for count, appeared in good_events:
            results[appeared] = count

        for count, appeared in bad_events:
            if appeared in results:
                results[appeared] = results[appeared] - count
            else:
                results[appeared] = -count

        return results

    @hybrid_property
    def participants(self):
        return db.session.query(User).filter(User._events.any(Event.video_id == self.video_id))

    def save(self, commit=True):
        try:
            db.session.add(self)
            if commit:
                db.session.commit()
        except SQLAlchemyError:
            return False

        return True


class Event(db.Model, JsonifiedModel):
    __tablename__ = 'events'

    event_id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    _user = db.relationship('User', uselist=False)

    video_id = db.Column(db.Integer, db.ForeignKey('videos.video_id'))
    _video = db.relationship('Video', uselist=False)

    registered = db.Column(db.DateTime, default=datetime.now())
    appeared = db.Column(db.Integer)
    disappeared = db.Column(db.Integer)

    #comment
    _content = db.Column(db.LargeBinary())
    category = db.Column(db.Enum('text', 'image', 'movie', 'good', 'bad', name='event_category'))

    parent_id = db.Column(db.Integer, db.ForeignKey('events.event_id'))
    _parent = db.relationship('Event', remote_side=[event_id], uselist=False)
    _children = db.relationship('Event', uselist=True, lazy='dynamic')

    permission = db.Column(db.Enum('inherited', 'private', 'public', 'protected', name='event_permission'))

    _coord_x = db.Column(db.Integer)
    _coord_y = db.Column(db.Integer)
    _width = db.Column(db.Integer)
    _height = db.Column(db.Integer)

    def __init__(self, user, video, appeared, disappeared, content, category,
                 coord=(0, 0), size=(0, 0), permission='public', parent=None):
        self._user = user
        self._video = video
        self.appeared = appeared
        self.disappeared = disappeared
        self.content = content
        self.category = category
        self._parent = parent
        self.permission = permission
        self.coord = coord
        self.size = size

    @hybrid_property
    def content(self):
        return self._content.decode('utf-8')

    @content.setter
    def content(self, value):
        if isinstance(value, unicode):
            self._content = value.encode('utf-8')
        else:
            self._content = value

    @hybrid_property
    def coord(self):
        return self._coord_x, self._coord_y

    @coord.setter
    def coord(self, value):
        self._coord_x, self._coord_y = value

    @hybrid_property
    def size(self):
        return self._width, self._height

    @size.setter
    def size(self, value):
        self._width, self._height = value

    def __repr__(self):
        return '<Event {0}> {1}'.format(self.event_id, self.content)

    @classmethod
    def by_event_id(cls, event_id):
        try:
            return db.session.query(Event).filter(Event.event_id == event_id).first()
        except SQLAlchemyError:
            return None

    def save(self, commit=True):
        try:
            db.session.add(self)
            if commit:
                db.session.commit()
        except SQLAlchemyError:
            return False

        return True
