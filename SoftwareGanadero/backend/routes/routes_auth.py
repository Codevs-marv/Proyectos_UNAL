from flask import Blueprint, request, jsonify
from models import db, Usuario
from werkzeug.security import check_password_hash

routes_auth = Blueprint("routes_auth", __name__)

@routes_auth.route("/login", methods=["POST"])
def login():
    data = request.json
    correo = data.get("correo")
    contrasena = data.get("contrasena")

    if not correo or not contrasena:
        return jsonify({"error": "Faltan datos"}), 400

    usuario = Usuario.query.filter_by(correo=correo).first()

    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Comparar la contraseña encriptada
    if not usuario.check_password(contrasena):
        return jsonify({"error": "Credenciales incorrectas"}), 401

    return jsonify({
        "mensaje": "Login exitoso",
        "usuario": usuario.to_json()
    }), 200
