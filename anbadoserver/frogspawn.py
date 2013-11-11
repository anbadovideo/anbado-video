# -*- coding: utf-8 -*-
""":mod:`anbadoserver.frogspawn` --- Data Aggregation Framework in Anbado Video Solution
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
"""
from flask import json
import redis
import datetime


class Frog(object):
    """Factory Class of frogspawn framework"""
    def __init__(self, app):
        """Initialize Frog instance.

            :param app: Flask application object
            :type app: flask.Flask
        """
        self.app = app
        self.spawns = {
            'dummy': DummyFrogspawn,
            'redis': RedisFrogspawn
        }

    def breed(self, name):
        """Create new frogspawn instance by given type name.

            :param name: name of frogspawn type
            :type name: str
            :returns: new frogspawn instance
            :exception SpawnNotFoundError: when no spawn found by given type name
        """
        name = name.lower()

        if name not in self.spawns:
            raise SpawnNotFoundError

        return self.spawns[name](self.app)


class Frogspawn(object):
    """Frogspawn Interface"""
    def put(self, msg):
        """Save event to data storage.

            :param msg: data to save
            :type msg: dict
        """
        raise NotImplementedError


class DummyFrogspawn(Frogspawn):
    """Frogspawn that don't aggregate any event

        The name of dummy frogspawn is 'dummy'.
    """
    def __init__(self, app):
        super(DummyFrogspawn, self).__init__()

    def put(self, msg):
        pass


class RedisFrogspawn(Frogspawn):
    """Frogspawn that aggregate events using Redis

        The name of redis frogspawn is 'redis'.

        For use this frogspawn, flask application object must have some data.
            * FROGSPAWN_REDIS_HOST: redis server host address
            * FROGSPAWN_REDIS_PORT: redis server port
            * FROGSPAWN_REDIS_DB: redis database name
            * FROGSPAWN_REDIS_CHANNEL: redis channel name

    """
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
        """Save event to redis storage.

            This method adds `occured` field containing time information.

            :param msg: data to save
            :type msg: dict
        """
        msg['occured'] = datetime.datetime.now().strftime(self.app.config.get('FROGSPAWN_DATEFORMAT', '%Y-%m-%d %H:%M:%S'))
        self.redis.publish(self.channel, json.dumps(msg))


class SpawnNotFoundError(Exception):
    pass