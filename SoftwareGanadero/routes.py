from flask import Blueprint, request, jsonify
from models import db, Animal



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
