from app import app
from models import db, Usuario

with app.app_context():
    usuarios = Usuario.query.all()
    
    if not usuarios:
        print("⚠️ No se encontraron usuarios en la base de datos.")
    else:
        for usuario in usuarios:
            print(f"👤 Usuario encontrado: {usuario.correo} - Contraseña: {usuario.contraseña}")
