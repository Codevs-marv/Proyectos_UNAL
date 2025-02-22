from app import app
from models import db, Usuario
from werkzeug.security import generate_password_hash

with app.app_context():

    usuarios = Usuario.query.all()
    for usuario in usuarios:
        print(f"👤 Usuario encontrado: {usuario.correo} - Contraseña: {usuario.contraseña}")