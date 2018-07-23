from  datetime import date
from models.model import  Sites
from models.model import Coordonnates
from models.db_connection  import Session,engine,Base

session=Session()

coord=session.query(Sites)

for c in coord:
    print(f'{c.id} ')
    for x in c.coordonnates:
        print(x.lat)
