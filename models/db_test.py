from  datetime import date
from models.model import  Sites,Type_utilisateur,Type_prelevement,Utilisateur
from models.model import Coordonnates
from models.db_connection  import Session,engine,Base

Base.metadata.create_all(engine)
session=Session()
type=session.query(Type_utilisateur).get(2)
print(type)

utilisateur=Utilisateur("MALENGELA","MPASA","Josue","09898325235","mail@gmail.com",'cartographe1',"carto123")
type.utilisateurs.append(utilisateur)
session.add(type)
session.commit()
session.close()