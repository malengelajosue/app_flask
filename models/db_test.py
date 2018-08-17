from  datetime import date
from models.model import  Sites
from models.model import Coordonnates
from models.db_connection  import Session,engine,Base

Base.metadata.create_all(engine)
session=Session()
s1=Sites('gcm',1,'un tres bon site')

#persistances

r=session.query(Sites).get(9)
coord=r.coordonnates
print(r.capture_type)
myList=[]
myList.append({'type':r.capture_type})
for i in coord:
    mydic={}
    mydic['lat']=i.lat
    mydic['lng'] = i.long
    myList.append(mydic)


print (myList)
session.close()