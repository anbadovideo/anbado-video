#!/usr/bin/env python
# -*- coding: utf-8 -*-
import datetime
from flask import Response
from flask.ext.sqlalchemy import BaseQuery
from anbadoserver import db

try:
    import json
except ImportError:
    import simplejson as json


class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.ctime()
        elif isinstance(obj, datetime.time):
            return obj.isoformat()
        # for SQLAlchemy Model Object
        elif isinstance(obj, db.Model):
            fields = {}

            # initialize blacklists
            blacklists = list(getattr(obj, '__json_blacklists__', []))
            blacklists.append('save')

            for field in [x for x in dir(obj) if
                          not x.startswith(('_', 'by_')) and x != 'metadata' and x not in blacklists]:

                # for Lazy Loading in SQLAlchemy
                if isinstance(getattr(obj, field), (BaseQuery, type)):
                    continue

                # data dump
                data = obj.__getattribute__(field)

                try:
                    json.dumps(data)
                    fields[field] = data
                except TypeError:
                    fields[field] = None
            return fields

        return json.JSONEncoder.default(self, obj)


def jsonify(*args, **kwargs):
    data = dict(*args, **kwargs)

    return Response(json.dumps(data, cls=JSONEncoder), mimetype='application/json')
