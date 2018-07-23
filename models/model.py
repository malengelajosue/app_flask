#!/usr/bin/env python
from sqlalchemy import Column, String, Integer, Date, Text, ForeignKey
from sqlalchemy.orm import relationship

from . db_connection import Base
from datetime import datetime

class Sites(Base):
    __tablename__='sites'
    id=Column(Integer, primary_key=True)
    name = Column(String(100))
    capture_type = Column(String(100))
    description = Column(Text)
    coordonnates=relationship("Coordonnates")
    create_at = Column(Date, nullable=True, default=datetime.utcnow)
    update_at = Column(Date, nullable=True)

    def __init__(self,name,capture_type,description):
        self.name=name
        self.capture_type=capture_type
        self.description=description


class Coordonnates(Base):
    __tablename__='coordonnates'
    id = Column(Integer, primary_key=True)
    lat=Column(String(50))
    long=Column(String(50))
    alt=Column(String(50))
    moment=Column(Date,nullable=True)
    site_id=Column(Integer,ForeignKey('sites.id'))

    def __init__(self,lat,long,alt,moment):
        self.lat=lat
        self.long=long
        self.alt=alt
        self.moment=moment



