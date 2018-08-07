from  datetime import date
from models.model import  Sites
from models.model import Coordonnates
from models.db_connection  import Session,engine,Base
from sqlalchemy import or_

session=Session()

coord=session.query(Sites).filter(or_(Sites.name.ilike("%%"),Sites.description.ilike("%%")))

for c in coord:
    print(f'{c.id} ')
    for x in c.coordonnates:
        print(x.lat)
