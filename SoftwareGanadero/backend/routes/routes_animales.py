from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from models import db, Animal, AnimalesEliminados
from flask_cors import cross_origin
from datetime import datetime
import os

routes = Blueprint("routes", __name__)


# Obtener todos los animales
@routes.route("/animales", methods=["GET"])


# ✅ Obtener todos los animales
def obtener_animales():
    animales = Animal.query.all()
    animales_lista = [
        {
            "id": animal.id,
            "marca": animal.marca,
            "sexo": animal.sexo,
            "edad": animal.edad,
            "raza": animal.raza,
            "peso": animal.peso,
            "proposito": animal.proposito,
            "fechaNacimiento": animal.fechaNacimiento,
            "lote": animal.lote,
            "cantidadPartos": animal.cantidadPartos,
            "fechaUltimoParto": animal.fechaUltimoParto
        }
        for animal in animales
    ]
    return jsonify(animales_lista)


# ✅ Buscar un animal por ID
@routes.route("/animales/<int:id>", methods=["GET"])
def obtener_animal(id):
    animal = Animal.query.get(id)
    if not animal:
        return jsonify({"error": "Animal no encontrado"}), 404

    return jsonify({
        "id": animal.id,
        "sexo": animal.sexo,
        "marca": animal.marca,
        "edad": animal.edad,
        "raza": animal.raza,
        "peso": animal.peso,
        "proposito": animal.proposito,
        "fechaNacimiento": animal.fechaNacimiento,
        "lote": animal.lote,
        "cantidadPartos": animal.cantidadPartos,
        "fechaUltimoParto": animal.fechaUltimoParto
    })


# ✅ Añadir un nuevo animal
@routes.route("/animales", methods=["POST"])
def agregar_animal():
    data = request.get_json()
    nuevo_animal = Animal(
        sexo=data["sexo"],
        edad=data["edad"],
        marca=data["marca"],
        raza=data["raza"],
        peso=data["peso"],
        proposito=data["proposito"],
        fechaNacimiento=data["fechaNacimiento"],
        lote=data["lote"],
        cantidadPartos=data["cantidadPartos"],
        fechaUltimoParto=data["fechaUltimoParto"]
    )
    db.session.add(nuevo_animal)
    db.session.commit()

    return jsonify({"mensaje": "Animal agregado correctamente"}), 201


# ✅ Editar un animal
@routes.route("/animales/<int:id>", methods=["PUT"])
def editar_animal(id):
    data = request.get_json()
    animal = Animal.query.get(id)
    if not animal:
        return jsonify({"error": "Animal no encontrado"}), 404

    animal.sexo = data["sexo"]
    animal.edad = data["edad"]
    animal.marca = data["marca"]
    animal.raza = data["raza"]
    animal.peso = data["peso"]
    animal.proposito = data["proposito"]
    animal.fechaNacimiento = data["fechaNacimiento"]
    animal.lote = data["lote"]
    animal.cantidadPartos = data["cantidadPartos"]
    animal.fechaUltimoParto = data["fechaUltimoParto"]

    db.session.commit()
    return jsonify({"mensaje": "Animal actualizado correctamente"})


# ✅ Obtener la lista de animales eliminados (papelera de reciclaje)
@routes.route("/papelera", methods=["GET"])
@cross_origin()  # 🔹 Permitir CORS en esta ruta específica
def obtener_papelera():
    animales_eliminados = AnimalesEliminados.query.all()
    
    return jsonify([
        {
            "id": animal.id,
            "raza": animal.raza,
            "edad": animal.edad,
            "peso": animal.peso,
            "sexo": animal.sexo,
            "marca": animal.marca,
            "proposito": animal.proposito,
            "fechaNacimiento": animal.fechaNacimiento,
            "lote": animal.lote,
            "cantidadPartos": animal.cantidadPartos,
            "fechaUltimoParto": animal.fechaUltimoParto,
            "fecha_eliminacion": animal.fecha_eliminacion
        }
        for animal in animales_eliminados
    ]), 200

# ✅ Mover un animal a la papelera en lugar de eliminarlo
@routes.route("/animales/<int:id>", methods=["DELETE"])
def eliminar_animal(id):
    animal = Animal.query.get(id)
    if not animal:
        return jsonify({"error": "Animal no encontrado"}), 404

    # Mover el animal a la tabla AnimalesEliminados
    animal_eliminado = AnimalesEliminados(
        id=animal.id,
        raza=animal.raza,
        edad=animal.edad,
        peso=animal.peso,
        sexo=animal.sexo,
        marca=animal.marca,
        proposito=animal.proposito,
        fechaNacimiento=animal.fechaNacimiento,
        lote=animal.lote,
        cantidadPartos=animal.cantidadPartos,
        fechaUltimoParto=animal.fechaUltimoParto,
        fecha_eliminacion=datetime.utcnow()
    )
    
    db.session.add(animal_eliminado)
    db.session.delete(animal)  # Eliminar de la tabla original
    db.session.commit()

    return jsonify({"mensaje": "Animal movido a la papelera de reciclaje"}), 200


# ✅ Restaurar un animal desde la papelera
@routes.route("/animales/restaurar/<int:id>", methods=["PUT"])
def restaurar_animal(id):
    animal = AnimalesEliminados.query.get(id)
    if not animal:
        return jsonify({"error": "Animal no encontrado en la papelera"}), 404

    # Restaurar el animal a la tabla principal
    animal_restaurado = Animal(
        id=animal.id,
        raza=animal.raza,
        edad=animal.edad,
        peso=animal.peso,
        sexo=animal.sexo,
        marca=animal.marca,
        proposito=animal.proposito,
        fechaNacimiento=animal.fechaNacimiento,
        lote=animal.lote,
        cantidadPartos=animal.cantidadPartos,
        fechaUltimoParto=animal.fechaUltimoParto
    )

    db.session.add(animal_restaurado)
    db.session.delete(animal)  # Eliminar de la papelera
    db.session.commit()

    return jsonify({"mensaje": "Animal restaurado correctamente"}), 200


# ✅ Eliminacion automatica despues de 3 dias
@routes.route("/eliminar_definitivo", methods=["DELETE"])
def eliminar_definitivamente():
    from datetime import datetime, timedelta

    fecha_limite = datetime.utcnow() - timedelta(days=3)
    
    # Eliminar animales que llevan más de 3 días en la papelera
    AnimalesEliminados.query.filter(AnimalesEliminados.fecha_eliminacion < fecha_limite).delete()
    db.session.commit()

    return jsonify({"mensaje": "Animales eliminados permanentemente"}), 200




# Configuración para la carpeta donde se guardarán las imágenes
UPLOAD_FOLDER = "static/images"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

# Crear la carpeta si no existe
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    """Verifica si el archivo tiene una extensión permitida."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@routes.route("/subir_imagen", methods=["POST"])
def subir_imagen():
    """Maneja la subida de imágenes."""
    if "file" not in request.files:
        return jsonify({"error": "No se encontró el archivo"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Nombre de archivo vacío"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)  # Asegura un nombre de archivo seguro
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # Devuelve la URL donde se guardó la imagen
        return jsonify({"mensaje": "Imagen subida correctamente", "ruta": filepath}), 200
    else:
        return jsonify({"error": "Formato de imagen no permitido"}), 400