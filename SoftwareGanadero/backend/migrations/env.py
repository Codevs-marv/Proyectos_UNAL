import logging
from logging.config import fileConfig
from flask import current_app
from alembic import context
import os
import sys

# Asegura que se puedan importar módulos desde la raíz del proyecto
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import SQLALCHEMY_DATABASE_URI

# Alembic config
config = context.config

# Logging configuration desde alembic.ini
if config.config_file_name is not None:
    fileConfig(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'alembic.ini'))
logger = logging.getLogger('alembic.env')

def get_engine():
    try:
        return current_app.extensions['migrate'].db.get_engine()
    except (TypeError, AttributeError):
        return current_app.extensions['migrate'].db.engine

def get_engine_url():
    try:
        return get_engine().url.render_as_string(hide_password=False).replace('%', '%%')
    except AttributeError:
        return str(get_engine().url).replace('%', '%%')

# Setea la URL de SQLAlchemy para las migraciones
config.set_main_option('sqlalchemy.url', get_engine_url())
target_db = current_app.extensions['migrate'].db

def get_metadata():
    if hasattr(target_db, 'metadatas'):
        return target_db.metadatas[None]
    return target_db.metadata

def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=get_metadata(),
        literal_binds=True,
        compare_type=True
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Run migrations in 'online' mode."""
    from sqlalchemy import create_engine
    from app import app

    with app.app_context():
        connectable = create_engine(SQLALCHEMY_DATABASE_URI)
        with connectable.connect() as connection:
            context.configure(
                connection=connection,
                target_metadata=get_metadata(),
                include_schemas=True,
                render_as_batch=True
            )

            with context.begin_transaction():
                context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
