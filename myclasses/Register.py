from flask_wtf import FlaskForm
from wtforms import StringField,PasswordField
from wtforms.fields.html5 import EmailField,TelField
from wtforms.validators import InputRequired


class Register(FlaskForm):
    lastName=StringField('lastName',validators=[InputRequired()], render_kw={"placeholder": "Nom"})
    firstName = StringField('firstName', validators=[InputRequired()], render_kw={"placeholder": "Prenom"})
    email = EmailField('email', validators=[InputRequired()],render_kw={"placeholder": "Adresse email"})
    telephone = TelField('telephone', validators=[InputRequired()],render_kw={"placeholder": "Numero de telephone"})
    username = StringField('username', validators=[InputRequired()],render_kw={"placeholder": "Nom d'utilisateur"})
    password = PasswordField('password', validators=[InputRequired()],render_kw={"placeholder": "Mot de passe"})

    confPassword = PasswordField('confPassword', validators=[InputRequired()],render_kw={"placeholder": "Confirmer le mot de passe"})