from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash




db = SQLAlchemy()



class Usuario(db.Model):
    __tablename__ = "Usuarios"  # Nombre de la tabla en la BD

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(100), unique=True, nullable=False)
    contraseña = db.Column(db.String(255), nullable=False)  # Guardamos el hash
    rol = db.Column(db.String(20), nullable=False)  # "admin" o "empleado"

    def set_password(self, password):
        """Encripta la contraseña antes de guardarla"""
        self.contraseña = generate_password_hash(password)

    def check_password(self, password):
        """Verifica si la contraseña ingresada es correcta"""
        return check_password_hash(self.contraseña, password)




class Animal(db.Model):
    __tablename__ = "Animales"

    id = db.Column(db.Integer, primary_key=True)
    sexo = db.Column(db.String(10), nullable=False)
    marca = db.Column(db.String(10), nullable=False)
    edad = db.Column(db.Integer, nullable=False)
    raza = db.Column(db.String(100), nullable=False)
    peso = db.Column(db.Float, nullable=False)
    proposito = db.Column(db.String(100), nullable=False)
    fechaNacimiento = db.Column(db.Date, nullable=False)
    lote = db.Column(db.String(50), nullable=False)
    cantidadPartos = db.Column(db.Integer, nullable=True)
    fechaUltimoParto = db.Column(db.Date, nullable=True)
    #foto_url = db.Column(db.String(255), nullable=True)  # Nueva columna para la imagen

    def to_json(self):
        return {
            "id": self.id,
            "sexo": self.sexo,
            "marca": self.marca,
            "edad": self.edad,
            "raza": self.raza,
            "peso": self.peso,
            "proposito": self.proposito,
            "fechaNacimiento": str(self.fechaNacimiento),
            "lote": self.lote,
            "cantidadPartos": self.cantidadPartos,
            "fechaUltimoParto": str(self.fechaUltimoParto),
            #"fotoUrl": self.fotoUrl  # Retorna la URL de la imagen
        }




class Insumo(db.Model):
    __tablename__ = "insumos"

    descripcion = db.Column(db.String(255), primary_key=True)  # Clave primaria
    cantidad = db.Column(db.Integer, nullable=False)
    unidadDeMedida = db.Column(db.String(50), nullable=False)
    valorUnitario = db.Column(db.Float, nullable=False)
    stockMinimo = db.Column(db.Integer, nullable=False)

    def __init__(self, descripcion, cantidad, unidadDeMedida, valorUnitario, stockMinimo):
        self.descripcion = descripcion
        self.cantidad = cantidad
        self.unidadDeMedida = unidadDeMedida
        self.valorUnitario = valorUnitario
        self.stockMinimo = stockMinimo