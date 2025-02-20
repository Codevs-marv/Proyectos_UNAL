from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    descripcion = db.Column(db.String(20), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    unidadDeMedida = db.Column(db.String(10), nullable=False)
    valorUnitario = db.Column(db.Float, nullable=False)  # Usamos Float para representar el tipo Money
    stockMinimo = db.Column(db.Integer, nullable=False)
