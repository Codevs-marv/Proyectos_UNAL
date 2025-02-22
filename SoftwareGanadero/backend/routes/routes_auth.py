from flask import Blueprint, request, jsonify
from models import db, Usuario  

routes_auth = Blueprint("routes_auth", __name__)

@routes_auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    correo = data.get("correo")
    contrasena = data.get("contraseña")

    usuario = Usuario.query.filter_by(email=correo).first()

    if usuario and usuario.password == contrasena:  # ¡Mejor usar hashing en producción!
        return jsonify({"mensaje": "Inicio de sesión exitoso"}), 200
    else:
        return jsonify({"error": "Credenciales incorrectas"}), 401
