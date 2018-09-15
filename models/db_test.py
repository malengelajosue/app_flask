from  datetime import date
from models.model import  Sites,Type_utilisateur,Type_prelevement,Utilisateur
from models.model import Coordonnates
from models.db_connection  import Session,engine,Base

Base.metadata.create_all(engine)
session=Session()
username='josuemmmm'
user =session.query(Utilisateur).filter(Utilisateur.username.like('%'+username+'%')).all()
if  user==[]:
    print('vide')
else:

    print(user[0])
