#!/usr/bin/env python

from gevent import monkey
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from anbadoserver import config


monkey.patch_all()

app = Flask(__name__)
app.debug = config.DEBUG
app.config['SQLALCHEMY_DATABASE_URI'] = config.DATABASE_URI
db = SQLAlchemy(app)


def init_db():
    import anbadoserver.models

    sample = anbadoserver.models
    db.drop_all()
    db.create_all()


import anbadoserver.views
