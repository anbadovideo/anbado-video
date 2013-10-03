# -*- coding: utf-8 -*-
from flask import json
import redis
import datetime


class Frog(object):
    def __init__(self, app):
        self.app = app
        self.spawns = {
            'dummy': DummyFrogspawn,
            'redis': RedisFrogspawn
        }

    def breed(self, name):
        name = name.lower()

        if name not in self.spawns:
            raise SpawnNotFoundError

        return self.spawns[name](self.app)


class Frogspawn(object):
    def put(self, msg):
        raise NotImplementedError


class DummyFrogspawn(Frogspawn):
    def __init__(self, app):
        super(DummyFrogspawn, self).__init__()

    def put(self, msg):
        pass


class RedisFrogspawn(Frogspawn):
    def __init__(self, app):
        super(RedisFrogspawn, self).__init__()

        host = app.config.get('FROGSPAWN_REDIS_HOST', 'localhost')
        port = app.config.get('FROGSPAWN_REDIS_PORT', 6379)
        db = app.config.get('FROGSPAWN_REDIS_DB', 0)

        self.app = app
        self.channel = app.config.get('FROGSPAWN_REDIS_CHANNEL', 'frogspawn')
        self.pool = redis.ConnectionPool(host=host, port=port, db=db)
        self.redis = redis.Redis(connection_pool=self.pool)

    def put(self, msg):
        msg['occured'] = datetime.datetime.now().strftime(self.app.config.get('FROGSPAWN_DATEFORMAT', '%Y-%m-%d %H:%M:%S'))
        self.redis.publish(self.channel, json.dumps(msg))


class SpawnNotFoundError(Exception):
    pass