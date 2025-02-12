from flask import Flask
from config import SQLALCHEMY_DATABASE_URI
from models import db
from routes import routes
from flask_cors import CORS

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
CORS(app)

app.register_blueprint(routes)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)