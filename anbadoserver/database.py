#!/usr/bin/env python

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

import anbadoserver.config as Config


db_engine = create_engine(Config.DATABASE_URI, echo=Config.DEBUG, convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=db_engine))

Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    import anbadoserver.models

    sample = anbadoserver.models
    Base.metadata.create_all(bind=db_engine)
