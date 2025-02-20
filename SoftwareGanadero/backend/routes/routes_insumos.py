from flask import Blueprint, jsonify, request
from models import db, Insumo  

routes_insumos = Blueprint("routes_insumos", __name__, url_prefix="/insumos")

# Obtener todos los insumos en JSON
@routes_insumos.route("/", methods=["GET"])
def obtener_insumos():
    insumos = Insumo.query.all()
    insumos_json = [{
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
            valorUnitario=float(data.get("valorUnitario", 0.0)),
            stockMinimo=int(data.get("stockMinimo", 0))
        )
        db.session.add(nuevo_insumo)
        db.session.commit()
        return jsonify({"mensaje": "Insumo agregado correctamente"}), 201
    except ValueError:
        return jsonify({"error": "Datos inválidos"}), 400

# Editar un insumo por su descripción
@routes_insumos.route("/editar/<string:descripcion>", methods=["PUT"])
def editar_insumo(descripcion):
    insumo = Insumo.query.filter_by(descripcion=descripcion).first()
    if not insumo:
        return jsonify({"error": "Insumo no encontrado"}), 404

    data = request.json
    if not data:
        return jsonify({"error": "No se recibieron datos"}), 400

    try:
        insumo.cantidad = int(data.get("cantidad", insumo.cantidad))
        insumo.unidadDeMedida = data.get("unidadDeMedida", insumo.unidadDeMedida).strip()
        insumo.valorUnitario = float(data.get("valorUnitario", insumo.valorUnitario))
        insumo.stockMinimo = int(data.get("stockMinimo", insumo.stockMinimo))

        db.session.commit()
        return jsonify({"mensaje": "Insumo actualizado correctamente"}), 200
    except ValueError:
        return jsonify({"error": "Datos inválidos"}), 400

# Eliminar un insumo por su descripción
@routes_insumos.route("/eliminar/<string:descripcion>", methods=["DELETE"])
def eliminar_insumo(descripcion):
    insumo = Insumo.query.filter_by(descripcion=descripcion).first()
    if not insumo:
        return jsonify({"error": "Insumo no encontrado"}), 404

    db.session.delete(insumo)
    db.session.commit()
    return jsonify({"mensaje": "Insumo eliminado correctamente"}), 200
