from flask import Flask, request, session
from flask_session import Session 
from flask_sqlalchemy import SQLAlchemy
from config import SQLALCHEMY_DATABASE_URI
from flask_cors import CORS
from flask_migrate import Migrate

# 1. Primero creamos las instancias sin inicializar
db = SQLAlchemy()
migrate = Migrate()
sess = Session()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Configuración
    app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = "secreto123"
    app.config["SESSION_TYPE"] = "filesystem"
    
    # 2. Inicializamos las extensiones CON la app
    db.init_app(app)
    migrate.init_app(app, db)  # ¡Importante este orden!
    sess.init_app(app)
    
    # 3. Registramos blueprints (DESPUÉS de init_app)
    from routes.routes_animales import routes
    from routes.routes_insumos import routes_insumos
    from routes.routes_auth import routes_auth
    
    app.register_blueprint(routes_auth)
    app.register_blueprint(routes)
    app.register_blueprint(routes_insumos)
    
    return app

app = create_app()

# Rutas deben estar después de crear la app
@app.route("/subir_imagen", methods=["GET","POST"])
def subir_imagen():
    return {"mensaje": "Ruta funcionando correctamente"}

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)