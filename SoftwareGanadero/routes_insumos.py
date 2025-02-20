from flask import Blueprint, render_template, request, redirect, url_for
from models import db, Insumo  # Importar el modelo de insumos

routes_insumos = Blueprint("routes_insumos", __name__, url_prefix="/insumos")

# Ruta para ver todos los insumos
@routes_insumos.route("/", methods=["GET"])
def obtener_insumos():
    insumos = Insumo.query.all()
    return render_template("insumos/listar.html", insumos=insumos)

# Ruta para agregar un insumo
@routes_insumos.route('/agregar', methods=['GET', 'POST'])
def agregar_insumo():
    if request.method == 'POST':
        descripcion = request.form['descripcion']
        cantidad = request.form['cantidad']
        unidad = request.form['unidad']
        valor = request.form['valor']
        stock_min = request.form['stock_min']
        
        nuevo_insumo = Insumo(
            descripcion=descripcion, 
            cantidad=cantidad, 
            unidadDeMedida=unidad, 
            valorUnitario=valor, 
            stockMinimo=stock_min
        )
        
        db.session.add(nuevo_insumo)
        db.session.commit()
        
        return redirect(url_for('routes_insumos.obtener_insumos'))
    
    return render_template('insumos/agregar.html')

# Ruta para editar un insumo
@routes_insumos.route('/editar/<int:id>', methods=['GET', 'POST'])
def editar_insumo(id):
    insumo = Insumo.query.get_or_404(id)
    if request.method == 'POST':
        insumo.descripcion = request.form['descripcion']
        insumo.cantidad = request.form['cantidad']
        insumo.unidadDeMedida = request.form['unidad']
        insumo.valorUnitario = request.form['valor']
        insumo.stockMinimo = request.form['stock_min']
        
        db.session.commit()
        return redirect(url_for('routes_insumos.obtener_insumos'))
    
    return render_template('insumos/editar.html', insumo=insumo)

# Ruta para eliminar un insumo
@routes_insumos.route('/eliminar/<int:id>')
def eliminar_insumo(id):
    insumo = Insumo.query.get_or_404(id)
    db.session.delete(insumo)
    db.session.commit()
    return redirect(url_for('routes_insumos.obtener_insumos'))
