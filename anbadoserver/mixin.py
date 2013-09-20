# -*- coding: utf-8 -*-
import datetime
from flask import json
from flask.ext.sqlalchemy import BaseQuery
from sqlalchemy.orm import Query


class JsonifiedModel(object):
    def to_json(self):
        results = {}

        for field in [x for x in dir(self) if not x.startswith('_')]:
            attr = getattr(self, field)
            if isinstance(attr, (BaseQuery, type, Query)) or callable(attr):
                continue
            elif isinstance(attr, (datetime.datetime, datetime.date)):
                attr = attr.ctime()
            elif isinstance(attr, datetime.time):
                attr = attr.isoformat()

            try:
                json.dumps(attr)
                results[field] = attr
            except TypeError:
                continue

        return results
