from app import app
from models import db, Usuario
from werkzeug.security import generate_password_hash
from sqlalchemy import text

with app.app_context():
    try:
        usuarios = Usuario.query.all()

        for usuario in usuarios:
            usuario.contrasena = generate_password_hash(usuario.contrasena)

        db.session.commit()
        print("✅ Contraseñas encriptadas correctamente.")
    except Exception as e:
        print(f"❌ Error al encriptar las contraseñas: {e}")
