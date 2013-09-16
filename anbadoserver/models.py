#!/usr/bin/env python
# -*- coding: utf-8 -*-

from datetime import datetime

from sqlalchemy import (
    or_,
    and_,
    func)
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.exc import SQLAlchemyError

from anbadoserver import db


user_user_association_table = db.Table(
    'user_user_association_table', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('users.user_id'), primary_key=True),
    db.Column('friend_id', db.Integer, db.ForeignKey('users.user_id'), primary_key=True)
)


class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    profile_image = db.Column(db.String(2048, convert_unicode=True))
    videos = db.relationship('Video', uselist=True, lazy='dynamic')
    events = db.relationship('Event', uselist=True, lazy='dynamic')
    friends = db.relationship('User', uselist=True, lazy='dynamic',
                              secondary=user_user_association_table,
                              primaryjoin=(user_id == user_user_association_table.c.user_id),
                              secondaryjoin=(user_id == user_user_association_table.c.friend_id),
    )

    def __init__(self, profile_image):
        self.profile_image = profile_image

    def __repr__(self):
        return '<User {0}> {1}'.format(self.user_id, self.profile_image)

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


class Video(db.Model):
    __tablename__ = 'videos'
    __json_blacklists__ = ('user', 'event_permitted_to')

    video_id = db.Column(db.Integer, primary_key=True)
    provider = db.Column(db.Enum('youtube', 'vimeo', 'anbado'))
    provider_vid = db.Column(db.String(2048, convert_unicode=True))

    title = db.Column(db.String(2048, convert_unicode=True))
    length = db.Column(db.Integer, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    user = db.relationship('User', uselist=False)

    events = db.relationship('Event', uselist=True, lazy='dynamic')

    def __init__(self, provider, provider_vid, title, length, user):
        self.provider = provider
        self.provider_vid = provider_vid
        self.title = title
        self.length = length
        self.user = user

    def __repr__(self):
        return '<Video {0}> provider: {1}, vid: {2}'.format(self.video_id, self.provider, self.provider_vid)

    @classmethod
    def by_video_id(cls, video_id):
        try:
            return db.session.query(Video).filter(Video.video_id == video_id).first()
        except SQLAlchemyError:
            return None

    def event_permitted_to(self, user):
        try:
            # TODO: how to handle inherited permission.
            return self.events.join(Event.user).filter(
                or_(
                    Event.permission == 'public',
                    and_(
                        Event.permission == 'protected',
                        User.friends.any(User.user_id == user.user_id)
                    )
                )
            ).all()
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
        return db.session.query(User).filter(User.events.any(Event.video_id == self.video_id))

    def save(self, commit=True):
        try:
            db.session.add(self)
            if commit:
                db.session.commit()
        except SQLAlchemyError:
            return False

        return True


class Event(db.Model):
    __tablename__ = 'events'

    event_id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    user = db.relationship('User', uselist=False)

    video_id = db.Column(db.Integer, db.ForeignKey('videos.video_id'))
    video = db.relationship('Video', uselist=False)

    registered = db.Column(db.DateTime, default=datetime.now())
    appeared = db.Column(db.Integer)
    disappeared = db.Column(db.Integer)

    #comment
    content = db.Column(db.String(2048, convert_unicode=True))
    category = db.Column(db.Enum('text', 'image', 'movie', 'good', 'bad'))

    parent_id = db.Column(db.Integer, db.ForeignKey('events.event_id'))
    parent = db.relationship('Event', remote_side=[event_id], uselist=False)
    children = db.relationship('Event', uselist=True, lazy='dynamic')

    permission = db.Column(db.Enum('inherited', 'private', 'public', 'protected'))

    coord_x = db.Column(db.Integer)
    coord_y = db.Column(db.Integer)
    width = db.Column(db.Integer)
    height = db.Column(db.Integer)

    def __init__(self, user, video, appeared, disappeared, content, category,
                 coord=(0, 0), size=(0, 0), permission='public', parent=None):
        self.user = user
        self.video = video
        self.appeared = appeared
        self.disappeared = disappeared
        self.content = content
        self.category = category
        self.parent = parent
        self.permission = permission
        self.coord = coord
        self.size = size

    @hybrid_property
    def coord(self):
        return self.coord_x, self.coord_y

    @coord.setter
    def coord(self, value):
        self.coord_x, self.coord_y = value

    @hybrid_property
    def size(self):
        return self.width, self.height

    @size.setter
    def size(self, value):
        self.width, self.height = value

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
