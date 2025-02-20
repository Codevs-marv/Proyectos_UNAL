from flask import Blueprint, jsonify, request
from models import db, Insumo  # Importar el modelo de insumos

routes_insumos = Blueprint("routes_insumos", __name__, url_prefix="/insumos")

# Ruta para obtener todos los insumos en formato JSON
@routes_insumos.route("/", methods=["GET"])
def obtener_insumos():
    insumos = Insumo.query.all()
    insumos_json = [{
        "id": insumo.id,
        "descripcion": insumo.descripcion,
        "cantidad": insumo.cantidad,
        "unidadDeMedida": insumo.unidadDeMedida,
        "valorUnitario": insumo.valorUnitario,
        "stockMinimo": insumo.stockMinimo
    } for insumo in insumos]
    return jsonify(insumos_json)

# Ruta para agregar un insumo
@routes_insumos.route("/agregar", methods=["POST"])
def agregar_insumo():
    data = request.json
    nuevo_insumo = Insumo(
        descripcion=data["descripcion"],
        cantidad=data["cantidad"],
        unidadDeMedida=data["unidad"],
        valorUnitario=data["valor"],
        stockMinimo=data["stock_min"]
    )
    db.session.add(nuevo_insumo)
    db.session.commit()
    return jsonify({"mensaje": "Insumo agregado correctamente", "id": nuevo_insumo.id})

# Ruta para editar un insumo
@routes_insumos.route("/editar/<int:id>", methods=["PUT"])
def editar_insumo(id):
    insumo = Insumo.query.get(id)
    if not insumo:
        return jsonify({"error": "Insumo no encontrado"}), 404
    
    data = request.json
    insumo.descripcion = data["descripcion"]
    insumo.cantidad = data["cantidad"]
    insumo.unidadDeMedida = data["unidad"]
    insumo.valorUnitario = data["valor"]
    insumo.stockMinimo = data["stock_min"]
    
    db.session.commit()
    return jsonify({"mensaje": "Insumo actualizado correctamente"})

# Ruta para eliminar un insumo
@routes_insumos.route("/eliminar/<int:id>", methods=["DELETE"])
def eliminar_insumo(id):
    insumo = Insumo.query.get(id)
    if not insumo:
        return jsonify({"error": "Insumo no encontrado"}), 404
    
    db.session.delete(insumo)
    db.session.commit()
    return jsonify({"mensaje": "Insumo eliminado correctamente"})
