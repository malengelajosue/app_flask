from  datetime import date
from models.model import  Sites
from models.model import Coordonnates
from models.db_connection  import Session,engine,Base

Base.metadata.create_all(engine)
session=Session()
s1=Sites('gcm',1,'un tres bon site')

c1=Coordonnates('-123131231','1123131','1234M',date(2018,3,23))
c2=Coordonnates('-2123131231','21123131','1534M',date(2018,2,23))

s1.coordonnates=[c1,c2]

#persistances
session.add(s1)

# commit
session.commit()

session.close()