#!/usr/bin/env python
# -*- coding: utf-8 -*-

from gevent import monkey
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from anbadoserver import config


monkey.patch_all()

app = Flask(__name__)
app.debug = config.DEBUG
app.config['SQLALCHEMY_DATABASE_URI'] = config.DATABASE_URI
app.config['SQLALCHEMY_ECHO'] = app.debug
db = SQLAlchemy(app)


def init_db():
    import anbadoserver.models

    sample = anbadoserver.models
    db.drop_all()
    db.create_all()


import anbadoserver.views
