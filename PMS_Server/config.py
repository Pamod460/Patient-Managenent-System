import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'my_secret_key'
    MYSQL_HOST = os.environ.get('MYSQL_HOST') or 'localhost'
    MYSQL_USER = os.environ.get('MYSQL_USER') or 'root'
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD') or '12345'
    MYSQL_DB = os.environ.get('MYSQL_DB') or 'pms_db'
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER') or 'app/static/uploads/'
