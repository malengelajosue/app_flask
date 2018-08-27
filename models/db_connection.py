#!/usr/bin/env python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH=os.path.join(BASE_DIR,'database/db.sqlite3')

engine=create_engine('sqlite:///'+DB_PATH,echo=True)

Session=sessionmaker(bind=engine)

Base=declarative_base()

