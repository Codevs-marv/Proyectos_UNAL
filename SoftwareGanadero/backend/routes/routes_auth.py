from flask import Blueprint, request, jsonify
from models import db, Usuario  # Asegúrate de tener el modelo Usuario

routes_auth = Blueprint("routes_auth", __name__)

@routes_auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    usuario = Usuario.query.filter_by(email=email).first()

    if usuario and usuario.password == password:  # ¡Mejor usar hashing en producción!
        return jsonify({"mensaje": "Inicio de sesión exitoso"}), 200
    else:
        return jsonify({"error": "Credenciales incorrectas"}), 401
