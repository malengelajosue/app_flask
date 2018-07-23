#!/usr/bin/env python
from flask import Flask, render_template, Response,abort
from camera_opencv import Camera
from  datetime import date
from models.model import  Sites
from models.model import Coordonnates
from models.db_connection  import Session,engine,Base

app = Flask(__name__)

@app.route('/')
def index():
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
    sites=session.query(Sites)
    print(type(sites))
    return render_template('timeline.html',sites=sites)



if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True)
