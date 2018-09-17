#!/usr/bin/env python
import signal
import sys
import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.wsgi as myapp_wsgi
from datetime import datetime
import time
import ast
import random
from  datetime import date
from models.model import  Sites
from models.model import Coordonnates
from models.db_connection  import Session,engine,Base




from myclasses.gpsaccess import Gpsaccess as Gps

# Javascript Usage:
# var ws = new WebSocket('ws://localhost:8000/ws');
# ws.onopen = function(event){ console.log('socket open'); }
# ws.onclose = function(event){ console.log('socket closed'); }
# ws.onerror = function(error){ console.log('error:', err); }
# ws.onmessage = function(event){ console.log('message:', event.data); }
# # ... wait for connection to open
# ws.send('hello world')


class MyAppWebSocket(tornado.websocket.WebSocketHandler):
    # Simple Websocket echo handler. This could be extended to
    # use Redis PubSub to broadcast updates to clients.

    def getPosition(self):
        self.connected = False
        if self.connected == False:
            self.gpsDevice = Gps()
            self.myCoord = ''
            self.connected = True


        time.sleep(0.5)
        coordonnates = self.gpsDevice.readCoordonates()
        self.myCoord = coordonnates
        if coordonnates != {}:
            self.lat = float(coordonnates['latitude'])
            self.long = float(coordonnates['longitude'])
            self.alt = coordonnates['altitude']
            self.speed = coordonnates['speed']
            self.course = coordonnates['course']
            self.satellite = coordonnates['satellite']
            self.moment = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            coordonnates = {'Lat': self.lat, 'Long': self.long, 'Alt': self.alt, 'Moment': self.moment, 'Sat': self.satellite,'Course': self.course, 'Speed': self.speed}
            self.write_message(coordonnates)
            if self.persit==True:
                self.saveCoordonates()

        else:
            self.write_message({'status':0})

        return coordonnates



    def open(self):
        self.persit=False
        self.mysite = ''
    def on_message(self, message):

        message=ast.literal_eval(message)
        print(message)
        coordonates={}

        if message.get('action')=='get_position':
            coordonates=self.getPosition()
        elif message.get('action')=='start_persiste':
            print("start persisting....")
            self.site_name=str(message.get('site_name'))
            self.capture_type=str(message.get('type'))
            self.description=str(message.get('description'))

            _name=self.site_name
            _description=self.description
            _type=self.capture_type

            mySite=Sites(name=_name,description=_description,type_prelevement=_type)
            self.mysite=mySite
            self.persit = True
        elif message.get('action')=='stop_persiste':
            self.persit=False
            session=Session()
            session.add(self.mysite)
            session.commit()
            session.close()
        elif message.get('action')=='gps_test':
            self.getPosition()
            print('gps test')
        elif message.get('action') == 'multiwii_test':
            self.getPosition()
            print('Multiwii test')
        elif message.get('action') == 'arm_test':
            self.getPosition()
            print('Arm test')

    def run(self):
        time.sleep(1)
        return

    def on_close(self):
        try:
            print
            'connection closed'
        except tornado.websocket.WebSocketClosedError:
            print('connection fermee de maniere inatendu!')
            self.close()

    def check_origin(self, origin):
        return True


    def saveCoordonates(self):
        _lat=str(self.lat)
        _long=str(self.long)
        _alt=str(self.alt)
        _moment=datetime.now()
        _vitesse=str(self.speed)
        _course=str(self.course)
        _satellite=str(self.satellite)

        coord=Coordonnates(lat=_lat,long=_long,alt=_alt,moment=_moment,speed=_vitesse,course=_course,satellite=_satellite)
        self.mysite.coordonnates.append(coord)




application = tornado.web.Application([
    (r'/ws', MyAppWebSocket),
    (r'/(.*)', tornado.web.FallbackHandler, dict(
        fallback=tornado.wsgi.WSGIContainer(myapp_wsgi)
    )),
], debug=True)

if __name__ == '__main__':


    application.listen(8001)
    instance=tornado.ioloop.IOLoop.instance()
    instance.start()




    def signal_handler(signal, frame):
        print('You pressed Ctrl+C!')
        instance.stop()
        sys.exit(0)


    signal.signal(signal.SIGINT, signal_handler)
    signal.pause()