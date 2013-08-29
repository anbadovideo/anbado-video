#!/usr/bin/env python

from datetime import datetime
from sqlalchemy import (
    Table,
    Column,
    ForeignKey,
    Integer,
    String,
    Enum,
    DateTime
    )
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from anbadoserver.database import Base


user_video_association_table = Table(
    'user_video_association_table', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.user_id')),
    Column('video_id', Integer, ForeignKey('videos.video_id'))
)

user_user_association_table = Table(
    'user_user_association_table', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.user_id'), primary_key=True),
    Column('friend_id', Integer, ForeignKey('users.user_id'), primary_key=True)
)


class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True)
    profile_image = Column(String(2048, convert_unicode=True))
    videos = relationship('Video', uselist=True, lazy='dynamic')
    events = relationship('Event', uselist=True, lazy='dynamic')
    friends = relationship('User', uselist=True, lazy='dynamic',
                           secondary=user_user_association_table,
                           primaryjoin=(user_id == user_user_association_table.c.user_id),
                           secondaryjoin=(user_id == user_user_association_table.c.friend_id)
    )

    def __init__(self, profile_image):
        self.profile_image = profile_image

    def __repr__(self):
        return '<User {0}> {1}'.format(self.user_id, self.profile_image)


class Video(Base):
    __tablename__ = 'videos'

    video_id = Column(Integer, primary_key=True)
    provider = Column(Enum('youtube', 'vimeo', 'anbado'))
    provider_vid = Column(String(2048, convert_unicode=True))

    user_id = Column(Integer, ForeignKey('users.user_id'))
    user = relationship('User', uselist=False)

    participants = relationship('User', secondary=user_video_association_table, uselist=True, lazy='dynamic')

    def __init__(self, provider, provider_vid, user):
        self.provider = provider
        self.provider_vid = provider_vid
        self.user = user

    def __repr__(self):
        return '<Video {0}> provider: {1}, vid: {2}'.format(self.video_id, self.provider, self.provider_vid)


class Event(Base):
    __tablename__ = 'events'

    event_id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey('users.user_id'))
    user = relationship('User', uselist=False)

    video_id = Column(Integer, ForeignKey('videos.video_id'))
    video = relationship('Video', uselist=False)

    registered = Column(DateTime, default=datetime.now())
    appeared = Column(Integer)
    disappeared = Column(Integer)

    content = Column(String(2048, convert_unicode=True))
    category = Column(Enum('text', 'image', 'movie'))

    parent_id = Column(Integer, ForeignKey('events.event_id'))
    parent = relationship('Event', remote_side=[event_id], uselist=False)
    children = relationship('Event', uselist=True, lazy='dynamic')

    permission = Column(Enum('inherited', 'private', 'public', 'protected'))

    coord_lx = Column(Integer)
    coord_rx = Column(Integer)
    coord_ty = Column(Integer)
    coord_by = Column(Integer)

    def __init__(self, user, video, appeared, disappeared, content, category, coord,
                 permission='public', parent=None):
        self.user = user
        self.video = video
        self.appeared = appeared
        self.disappeared = disappeared
        self.content = content
        self.category = category
        self.parent = parent
        self.permission = permission
        self.coord_lx, self.coord_rx, self.coord_ty, self.coord_by = coord

    @hybrid_property
    def coord(self):
        return self.coord_lx, self.coord_rx, self.coord_ty, self.coord_by

    def __repr__(self):
        return '<Event {0}> {1}'.format(self.event_id, self.content)
