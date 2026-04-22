import os
from pathlib import Path
from peewee import SqliteDatabase

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "courseforge.db"

database = SqliteDatabase(str(DB_PATH))


def init_db():
    database.connect()
    database.create_tables([], safe=True)
    return database


def get_db():
    return database