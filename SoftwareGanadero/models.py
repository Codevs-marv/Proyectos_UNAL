from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Animal(db.Model):
    __tablename__ = "Animales"  

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    edad = db.Column(db.Integer, nullable=False)
    raza = db.Column(db.String(100), nullable=False)
    peso = db.Column(db.Float, nullable=False)
    foto_url = db.Column(db.String(255))  # Guarda la URL de la foto

    def to_json(self):
        return {
            "id": self.id,
            "sexo": self.sexo,
            "edad": self.edad,
            "raza": self.raza,
            "peso": self.peso,
            "proposito": self.proposito,
            "fechaNacimiento": self.fechaNacimiento,
            "lote": self.lote,
            "cantidadPartos": self.cantidadPartos,
            "fechaUltimoParto": self.fechaUltimoParto,
            "foto_url": self.foto_url
        }
