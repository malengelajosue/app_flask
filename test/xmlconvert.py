import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH=os.path.join(BASE_DIR,'files/gpx/terain.gpx')

# !/usr/bin/python

import xml.sax
from models.db_connection import Session
from models.model import Sites,Coordonnates

class SitesHandle(xml.sax.ContentHandler):
    def __init__(self,name,description,type):
        self.CurrentData = ""
        self.trkpt = ""
        self.ele = ""
        self.time = ""
        self.description = ""
        self.moment=""
        self.lat=""
        self.lng=""
        self.ele=""
        self.satellite = ""
        self.speed = "0.0"
        self.course = "0.0"
        self.compteur=0
        self.mysite=Sites(name,type,description)


    # Call when an element starts
    def startElement(self, tag, attributes):
        self.CurrentData = tag
        if tag == "trkpt":
            print("*****track point*****")
            self.lat = attributes["lat"]
            print("latitude:", self.lat)
            self.lng = attributes["lon"]
            print("longitude:",self.lng)
            self.compteur+=1
            print(self.compteur)
            ##self.saveCoordonates()

    # Call when an elements ends
    def endElement(self, tag):
        if self.CurrentData == "ele":
            print("elebbb:", self.ele)

        elif self.CurrentData == "time":
            print("timebbb:", self.time)


        self.CurrentData = ""

    # Call when a character is read
    def characters(self, content):
        if self.CurrentData == "ele":
            self.ele = content
        elif self.CurrentData == "time":
            self.time = content

    def saveCoordonates(self):
        coord = Coordonnates(lat=self.lat, long=self.lng, alt=self.ele, moment=datetime.now(), speed=self.speed, course=self.course,satellite=self.satellite)
        self.mysite.coordonnates.append(coord)

    def saveNow(self):
        session=Session()
        session.add(self.mysite)
        session.commit()
        session.close()


if (__name__ == "__main__"):
    # create an XMLReader
    parser = xml.sax.make_parser()
    # turn off namepsaces
    parser.setFeature(xml.sax.handler.feature_namespaces, 0)

    # override the default ContextHandler
    Handler = SitesHandle("test1","mon de tout le temps",2)
    parser.setContentHandler(Handler)
    parser.parse(DB_PATH)
    Handler.saveNow()
