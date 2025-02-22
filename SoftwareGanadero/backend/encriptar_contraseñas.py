from backend.models import db, Usuario  # Ajusta la ruta si es necesario
from werkzeug.security import generate_password_hash
from backend.app import app  # Importa la app para establecer conexión con la BD

with app.app_context():
    usuarios = Usuario.query.all()

    for usuario in usuarios:
        usuario.contraseña = generate_password_hash(usuario.contraseña)

    db.session.commit()

print("✅ Contraseñas encriptadas correctamente.")
