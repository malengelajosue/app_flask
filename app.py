#!/usr/bin/env python
import os

from flask import Flask, render_template, Response,send_from_directory
from sqlalchemy import desc

from camera_opencv import Camera

from models.model import  Sites
from myclasses.gpx import get_gpx
from models.db_connection  import Session,engine,Base
path= os.path.dirname(os.path.abspath(__file__))
path=os.path.join(path,'files/gpx/')
DIRECTORY=path

app = Flask(__name__)
app.debug=True

@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('index.html')
@app.route('/home')
def home():
    """Video streaming home page."""
    return render_template('index.html')
@app.route('/map')
def map():
    """Video streaming home page."""
    return render_template('index.html')
@app.route('/control')
def control():
    """Video streaming home page."""
    return render_template('index.html')

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
@app.route('/sites')
def sites():
    session=Session()
    sites=session.query(Sites).order_by(desc(Sites.id))

    return render_template('timeline.html',sites=sites)
@app.route("/download/<id>")
def download_files(id):
    """Download files"""
    print("-----------------------------------------------------------------------------------"+get_gpx(id))
    return send_from_directory(DIRECTORY,get_gpx(id),as_attachment=True)


if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True)




