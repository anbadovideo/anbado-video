#!/usr/bin/env python
# -*- coding: utf-8 -*-
""":mod:anbadoserver.config --- Configuration Module

"""

DATABASE_URI = "sqlite:////tmp/anbado-test.db"
SOCKET_PORT = 8888
DEBUG = True

if not DEBUG:
    SQLALCHEMY_POOL_SIZE = 100

FROGSPAWN_TYPE = "dummy"

FROGSPAWN_REDIS_HOST = "localhost"
FROGSPAWN_REDIS_PORT = 6379
FROGSPAWN_REDIS_DB = 0
FROGSPAWN_REDIS_CHANNEL = "frogspawn"