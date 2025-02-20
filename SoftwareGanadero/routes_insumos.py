from flask import Blueprint, jsonify, request
from models import db, Insumo  

routes_insumos = Blueprint("routes_insumos", __name__, url_prefix="/insumos")

# Obtener todos los insumos en JSON
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
    return jsonify(insumos_json), 200

# Agregar un insumo
@routes_insumos.route("/agregar", methods=["POST"])
def agregar_insumo():
    data = request.json

    if not data:
        return jsonify({"error": "No se recibieron datos"}), 400

    try:
        nuevo_insumo = Insumo(
            descripcion=data.get("descripcion", "").strip(),
            cantidad=int(data.get("cantidad", 0)),
            unidadDeMedida=data.get("unidadDeMedida", "").strip(),
            valorUnitario=float(data.get("valor", 0.0)),
            stockMinimo=int(data.get("stockMinimo", 0))
        )
        db.session.add(nuevo_insumo)
        db.session.commit()
        return jsonify({"mensaje": "Insumo agregado correctamente", "id": nuevo_insumo.id}), 201
    except ValueError:
        return jsonify({"error": "Datos inválidos"}), 400

# Editar un insumo
@routes_insumos.route("/editar/<int:id>", methods=["PUT"])
def editar_insumo(id):
    insumo = Insumo.query.get(id)
    if not insumo:
        return jsonify({"error": "Insumo no encontrado"}), 404

    data = request.json
    if not data:
        return jsonify({"error": "No se recibieron datos"}), 400

    try:
        insumo.descripcion = data.get("descripcion", "").strip()
        insumo.cantidad = int(data.get("cantidad", insumo.cantidad))
        insumo.unidadDeMedida = data.get("unidadDeMedida", insumo.unidadDeMedida).strip()
        insumo.valorUnitario = float(data.get("valor", insumo.valorUnitario))
        insumo.stockMinimo = int(data.get("stockMinimo", insumo.stockMinimo))

        db.session.commit()
        return jsonify({"mensaje": "Insumo actualizado correctamente"}), 200
    except ValueError:
        return jsonify({"error": "Datos inválidos"}), 400

# Eliminar un insumo
@routes_insumos.route("/eliminar/<int:id>", methods=["DELETE"])
def eliminar_insumo(id):
    insumo = Insumo.query.get(id)
    if not insumo:
        return jsonify({"error": "Insumo no encontrado"}), 404

    db.session.delete(insumo)
    db.session.
