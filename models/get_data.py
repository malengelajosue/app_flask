

from models.db_connection  import Session
from models.model import  Sites
session=Session()
def get_data(id):

    r = session.query(Sites).get(id)
    coord = r.coordonnates
    myList = []
    myList.append({'type': r.capture_type})
    for i in coord:
        mydic = {}
        mydic['lat'] = i.lat
        mydic['lng'] = i.long
        myList.append(mydic)
    return myList

