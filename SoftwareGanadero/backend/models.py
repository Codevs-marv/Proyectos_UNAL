from backend.app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime





class Usuario(db.Model):
    __tablename__ = "DatosUsuarios"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(100), unique=True, nullable=False)
    contrasena = db.Column(db.String(255), nullable=False)  # Aumentamos a 255 caracteres
    rol = db.Column(db.String(50), nullable=False)

    def set_password(self, password):
        """Encripta la contraseña antes de guardarla"""
        self.contrasena = generate_password_hash(password)

    def check_password(self, password):
        """Verifica si la contraseña ingresada es correcta"""
        return check_password_hash(self.contrasena, password)
    
    def to_json(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "correo": self.correo,
            "rol": self.rol
        }



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
    eliminado = db.Column(db.Boolean, default=False)

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


class AnimalesEliminados(db.Model):
    __tablename__ = "animales_eliminados"

    id = db.Column(db.Integer, primary_key=True)
    raza = db.Column(db.String(50), nullable=False)
    edad = db.Column(db.Integer, nullable=False)
    peso = db.Column(db.Float, nullable=False)
    sexo = db.Column(db.String(10), nullable=False)
    marca = db.Column(db.String(10), nullable=False)
    proposito = db.Column(db.String(20), nullable=False)
    fechaNacimiento = db.Column(db.Date, nullable=False)
    lote = db.Column(db.String(20), nullable=False)
    cantidadPartos = db.Column(db.Integer, nullable=True)
    fechaUltimoParto = db.Column(db.Date, nullable=True)
    fecha_eliminacion = db.Column(db.DateTime, default=datetime.utcnow)  # Se guarda la fecha de eliminación



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