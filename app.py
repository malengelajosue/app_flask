#!/usr/bin/env python
import os
import sqlalchemy

from flask import Flask, render_template, Response, send_from_directory, jsonify
from sqlalchemy import desc,or_

from camera_opencv import Camera
from models.get_data import Details
from models.model import  Sites
from myclasses.gpx import get_gpx
from models.db_connection  import Session,engine,Base
path= os.path.dirname(os.path.abspath(__file__))
path=os.path.join(path,'files/gpx/')
DIRECTORY=path

app = Flask(__name__)
app.debug=True

#fonction de recuperation des donnees


#les routes utilisees par ajax
@app.route('/getdata_timeline')
def getdata_timeline():
    """Video streaming home page."""
    session = Session()
    sites = session.query(Sites).order_by(desc(Sites.id))

    return render_template('data.html',sites=sites)

@app.route('/')
def index():

    return render_template('startup_page.html')
@app.route('/home')
def home():

    return render_template('index.html')

@app.route('/carto')
def carto():

    return render_template('layouts/base.html')

@app.route('/get_trace_information/<id>')
def get_trace_information(id):
    data=Details()
    retour=data.get_details(id)
    print(retour)
    return jsonify(retour)

@app.route('/map')
def map():

    return render_template('map.html')
@app.route('/control')
def control():

    return render_template('control.html')
@app.route('/test')
def test1():

    return render_template('show.html')
def gen(camera):
    """Video streaming generator function."""
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')
@app.route('/sites/<field>')
def sites(field):

    field=""+field + ""
    session=Session()
    sites=session.query(Sites).filter(or_(Sites.name.ilike(field),Sites.description.ilike(field))).order_by(desc(Sites.id))

    return render_template('timeline.html',sites=sites)
@app.route("/download/<id>")
def download_files(id):
    """Download files"""
    print("-----------------------------------------------------------------------------------"+get_gpx(id))
    return send_from_directory(DIRECTORY,get_gpx(id),as_attachment=True)



if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True)




