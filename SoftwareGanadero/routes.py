from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from models import db, Animal
import os



routes = Blueprint("routes", __name__)

# Obtener todos los animales
@routes.route("/animales", methods=["GET"])
def obtener_animales():
    animales = Animal.query.all()
    return jsonify([animal.to_json() for animal in animales])

# Obtener un animal por ID
@routes.route("/animales/<int:id>", methods=["GET"])
def obtener_animal(id):
    animal = Animal.query.get(id)
    if not animal:
        return jsonify({"error": "Animal no encontrado"}), 404
    return jsonify(animal.to_json())

# Agregar un nuevo animal
@routes.route("/animales", methods=["POST"])
def agregar_animal():
    data = request.json
    nuevo_animal = Animal(
        nombre=data["nombre"],
        edad=data["edad"],
        raza=data["raza"],
        peso=data["peso"],
        foto_url=data.get("foto_url")  # Puede ser opcional
    )
    db.session.add(nuevo_animal)
    db.session.commit()
    return jsonify(nuevo_animal.to_json()), 201

# Editar un animal
@routes.route("/animales/<int:id>", methods=["PUT"])
def editar_animal(id):
    animal = Animal.query.get(id)
    if not animal:
        return jsonify({"error": "Animal no encontrado"}), 404

    data = request.json
    animal.nombre = data.get("nombre", animal.nombre)
    animal.edad = data.get("edad", animal.edad)
    animal.raza = data.get("raza", animal.raza)
    animal.peso = data.get("peso", animal.peso)
    animal.foto_url = data.get("foto_url", animal.foto_url)

    db.session.commit()
    return jsonify(animal.to_json())

# Eliminar un animal
@routes.route("/animales/<int:id>", methods=["DELETE"])
def eliminar_animal(id):
    animal = Animal.query.get(id)
    if not animal:
        return jsonify({"error": "Animal no encontrado"}), 404

    db.session.delete(animal)
    db.session.commit()
    return jsonify({"mensaje": "Animal eliminado exitosamente"})


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