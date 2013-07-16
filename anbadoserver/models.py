#!/usr/bin/env python

from datetime import datetime

from sqlalchemy import Table, Column, ForeignKey, Integer, String, Enum, DateTime, BigInteger
from sqlalchemy.orm import backref, relationship

from anbadoserver.database import Base


user_video_association_table = Table(
    'user_video_association_table', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.user_id')),
    Column('video_id', Integer, ForeignKey('videos.video_id'))
)


class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True)
    nickname = Column(String(64, convert_unicode=True), unique=True)
    profile_image = Column(String(2048, convert_unicode=True))
    events = relationship('Event', backref='user', uselist=True, lazy='dynamic')


class Video(Base):
    __tablename__ = 'videos'

    video_id = Column(Integer, primary_key=True)
    provider = Column(Enum(u'youtube', u'vimeo', u'anbado'))
    provider_vid = Column(String(2048, convert_unicode=True))

    user_id = Column(Integer, ForeignKey('users.user_id'))
    user = relationship('User')

    participants = relationship('User', secondary=user_video_association_table, uselist=True, lazy='dynamic')


class Event(Base):
    __tablename__ = 'events'

    event_id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey('users.user_id'))
    user = relationship('User', backref=backref('events', order_by=event_id.desc()))

    video_id = Column(Integer, ForeignKey('videos.video_id'))
    video = relationship('Video')

    registered = Column(DateTime, default=datetime.now())
    appeared = Column(BigInteger)
    disappeared = Column(BigInteger)

    content = Column(String(2048, convert_unicode=True))
    category = Column(Enum(u'text', u'image', u'movie'))

    parent_id = Column(Integer, ForeignKey('events.event_id'))
    parent = relationship('Event', remote_side=[event_id])
    children = relationship('Event', uselist=True, lazy='dynamic')

    permission = Column(Enum(u'inherited', u'private', u'public', u'protected'))

