#!/usr/bin/env python
from sqlalchemy import Column, String, Integer, Date, Text, ForeignKey,DateTime
from sqlalchemy.orm import relationship

from . db_connection import Base
from datetime import datetime

# les sites
class Sites(Base):
    __tablename__='sites'
    id=Column(Integer, primary_key=True)
    name = Column(String(100))
    type_prelevement = Column(Integer,ForeignKey('Type_prelevement.id'))
    description = Column(Text)
    coordonnates=relationship("Coordonnates")
    create_at = Column(Date, nullable=True, default=datetime.utcnow)
    update_at = Column(Date, nullable=True)

    def __init__(self,name,capture_type,description):
        self.name=name
        self.capture_type=capture_type
        self.description=description

#les coordonnees

class Coordonnates(Base):
    __tablename__='coordonnates'
    id = Column(Integer, primary_key=True)
    lat=Column(String(50))
    long=Column(String(50))
    alt=Column(String(50))
    speed = Column(String(50))
    course=Column(String(50))
    satellite=Column(String(50))
    moment=Column(DateTime,nullable=True)
    site_id=Column(Integer,ForeignKey('sites.id'))

    def __init__(self,lat,long,alt,speed,course,satellite,moment):
        self.lat=lat
        self.long=long
        self.alt=alt
        self.moment=moment
        self.satellite=satellite
        self.speed=speed
        self.course=course

#La classe utilisateur

class Utilisateur(Base):
    __tablename__='Utilisateur'
    id = Column(Integer, primary_key=True)
    nom=Column(String(50))
    postnom=Column(String(50))
    prenom=Column(String(50))
    telephone = Column(String(50))
    emails=Column(String(50))
    username=Column(String(50))
    password=Column(String(50))
    type_utilisateur_id=Column(Integer,ForeignKey('Type_utilisateur.id'))
    derniere_connection = Column(Date, nullable=True)
    date_creation = Column(Date, nullable=True, default=datetime.utcnow)

    def __init__(self,nom,postnom,prenom,telephone,emails,username,password):
        self.nom=nom
        self.postnom=postnom
        self.prenom=prenom
        self.telephone=telephone
        self.password=password
        self.emails=emails
        self.username=username

#La classe type d'utilisateur
class Type_utilisateur(Base):
    __tablename__='Type_utilisateur'
    id = Column(Integer, primary_key=True)
    nom=Column(String(50))
    utilisateurs=relationship('Utilisateur')
    description=Column(Text)
    date_creation = Column(Date, nullable=True, default=datetime.utcnow)


    def __init__(self,nom,description):
        self.nom=nom
        self.description=description




#La classe prelevement
class Type_prelevement(Base):
    __tablename__='Type_prelevement'
    id = Column(Integer, primary_key=True)
    nom=Column(String(50))
    description=Column(Text)
    sites=relationship('Sites')
    date_creation=Column(Date, nullable=True, default=datetime.utcnow)


    def __init__(self,nom,description):
        self.nom=nom
        self.description=description
