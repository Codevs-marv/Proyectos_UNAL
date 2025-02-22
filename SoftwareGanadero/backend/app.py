from flask import Flask, request, session
from flask_session import Session 
from flask_sqlalchemy import SQLAlchemy
from config import SQLALCHEMY_DATABASE_URI
from models import db
from routes.routes_animales import routes
from routes.routes_insumos import routes_insumos  # 🔹 Importar el Blueprint de insumos
from flask_cors import CORS
from flask_migrate import Migrate
from routes.routes_auth import routes_auth

app = Flask(__name__)

# Configuracion BD
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Configuración de la sesión
app.config["SECRET_KEY"] = "secreto123"  # Cambia esto por una clave segura
app.config["SESSION_TYPE"] = "filesystem"  # Almacena las sesiones en archivos temporales
Session(app)

@app.route("/subir_imagen", methods=["GET","POST"])
def subir_imagen():
    return {"mensaje": "Ruta funcionando correctamente"}

db.init_app(app)
CORS(app)
migrate = Migrate(app, db)

app.register_blueprint(routes_auth) # Blueprint de usuarios
app.register_blueprint(routes)  # Blueprint de animales
app.register_blueprint(routes_insumos)  # 🔹 Blueprint de insumos

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
