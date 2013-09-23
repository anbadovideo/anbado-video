#!/usr/bin/env python
# -*- coding: utf-8 -*-

from gevent import monkey
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from anbadoserver.frogspawn import Frog


monkey.patch_all()

app = Flask(__name__)
app.config.from_object('anbadoserver.config')
app.config['SQLALCHEMY_DATABASE_URI'] = app.config['DATABASE_URI']
app.config['SQLALCHEMY_ECHO'] = app.config['DEBUG']
db = SQLAlchemy(app)
frogspawn = Frog(app).breed(app.config['FROGSPAWN_TYPE'])


def init_db():
    import anbadoserver.models

    sample = anbadoserver.models
    db.drop_all()
    db.create_all()


import anbadoserver.views
