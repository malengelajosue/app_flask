import os
from pathlib import Path
from models.model import Sites , Coordonnates
from models.db_connection import  Session



def get_gpx(id):
    session=Session()
    site=session.query(Sites).get(id)
    path= os.path.dirname( os.path.dirname(os.path.abspath(__file__)))
    data_folder=Path(os.path.join(path,'files/gpx/'))
    name_off_file=''.join([str(site.name),'_',str(site.create_at),'.gpx'])
    file_open=data_folder/name_off_file
    f=open(file_open,'w')
    f.write(
    "<?xml version='1.0' encoding='UTF-8' standalone='yes' ?><gpx version=\"1.1\" creator=\"Josue MALENGELA - Elie KABUNDA\" xmlns=\"http://www.topografix.com/GPX/1/1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd\">"
    "\n\t<trk>"
    "\n\t\t<trkseg>"
    )
    for c in site.coordonnates:

        f.write(
            "\n\t\t\t<trkpt lat=\""+c.lat +"\" lon=\""+c.long+"\">"
            "\n\t\t\t\t<ele>"+c.alt[0:len(c.alt)-1]+"</ele>"
            "\n\t\t\t\t<time>"+str(c.moment)+"</time>"
          
            "\n\t\t\t\t<extensions>"
            "\n\t\t\t\t\t<speed>"+c.speed+"</speed>"
            "\n\t\t\t\t</extensions>"
            "\n\t\t\t </trkpt>"
        )


    f.write(

    "\n\t\t</trkseg>"
    "\n\t</trk>"
    "\n</gpx>"
    )

    return name_off_file
