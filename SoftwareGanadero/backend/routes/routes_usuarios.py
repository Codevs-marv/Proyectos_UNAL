from flask import Blueprint, request, jsonify
from models import db, Usuario

routes_usuarios = Blueprint("routes_usuarios", __name__, url_prefix="/usuarios")

@routes_usuarios.route("/login", methods=["POST"])
def login():
    data = request.json
    correo = data.get("correo")
    contraseña = data.get("contraseña")

    # Buscar usuario en la base de datos
    usuario = Usuario.query.filter_by(correo=correo).first()

    if usuario and usuario.check_password(contraseña):
        return jsonify({"mensaje": "Login exitoso", "usuario": usuario.nombre, "rol": usuario.rol}), 200
    else:
        return jsonify({"error": "Usuario o contraseña incorrectos"}), 401
