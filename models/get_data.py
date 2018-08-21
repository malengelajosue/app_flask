

from models.db_connection  import Session
from models.model import  Sites



class Details():
    def __init__(self):
        self.session=Session()

    def get_details(self,id):

        r = self.session.query(Sites).get(id)
        coord = r.coordonnates
        myList = []
        myList.append({'type': r.capture_type})
        for i in coord:
            mydic = {}
            mydic['lat'] = i.lat
            mydic['lng'] = i.long
            myList.append(mydic)

        self.session.close()
        return myList

