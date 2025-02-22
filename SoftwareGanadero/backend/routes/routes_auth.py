from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from models import db, Usuario

routes_auth = Blueprint("routes_auth", __name__)

@routes_auth.route("/login", methods=["POST"])
def login():
    data = request.json
    correo = data.get("correo")
    contrasena = data.get("contrasena")

    # Buscar usuario en la base de datos
    usuario = Usuario.query.filter_by(correo=correo).first()

    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Verificar la contraseña encriptada
    if not check_password_hash(usuario.contrasena, contrasena):
        return jsonify({"error": "Credenciales incorrectas"}), 401

    return jsonify({
        "mensaje": "Inicio de sesión exitoso",
        "usuario": usuario.to_json()
    }), 200
