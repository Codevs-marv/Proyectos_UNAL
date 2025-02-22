from flask import Blueprint, request, jsonify, session
from models import db, Usuario
from werkzeug.security import check_password_hash

routes_auth = Blueprint("routes_auth", __name__)


# RUTA PARA INICIAR SESION
@routes_auth.route("/login", methods=["POST"])
def login():
    data = request.json
    correo = data.get("correo")
    contrasena = data.get("contrasena")

    usuario = Usuario.query.filter_by(correo=correo).first()

    if not usuario or not check_password_hash(usuario.contrasena, contrasena):
        return jsonify({"error": "Credenciales incorrectas"}), 401

    # Guardar datos del usuario en la sesión
    session["usuario_id"] = usuario.id
    session["nombre"] = usuario.nombre
    session["correo"] = usuario.correo
    session["rol"] = usuario.rol

    return jsonify({"mensaje": "Inicio de sesión exitoso"})


# RUTA PARA OBTENER DATOS DEL USUARIO
@routes_auth.route("/usuario", methods=["GET"])
def obtener_usuario():
    if "usuario_id" not in session:
        return jsonify({"error": "No hay sesión activa"}), 401

    usuario = {
        "id": session["usuario_id"],
        "nombre": session["nombre"],
        "correo": session["correo"],
        "rol": session["rol"]
    }
    return jsonify({"usuario": usuario})


# RUTA PARA CERRAR SESION
@routes_auth.route("/logout", methods=["POST"])
def logout():
    session.clear()  # Elimina todos los datos de la sesión
    return jsonify({"mensaje": "Sesión cerrada exitosamente"})
