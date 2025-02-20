from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from config import SQLALCHEMY_DATABASE_URI
from models import db
from routes.routes_animales import routes
from routes.routes_insumos import routes_insumos  # 🔹 Importar el Blueprint de insumos
from flask_cors import CORS
from flask_migrate import Migrate

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

@app.route("/subir_imagen", methods=["GET","POST"])
def subir_imagen():
    return {"mensaje": "Ruta funcionando correctamente"}

db.init_app(app)
CORS(app)

migrate = Migrate(app, db)
app.register_blueprint(routes)  # Blueprint de animales
app.register_blueprint(routes_insumos)  # 🔹 Blueprint de insumos

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
