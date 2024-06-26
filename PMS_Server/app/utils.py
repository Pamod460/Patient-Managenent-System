from functools import wraps
from flask import redirect, url_for, flash,jsonify
from app import mysql, bcrypt
from app.db import fetch_one


def check_users_existence(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        cursor = mysql.connection.cursor()
        query = "SELECT COUNT(*) FROM users"
        cursor.execute(query)
        row = cursor.fetchone()
        cursor.close()
        user_count = row[0] if row else 0
        
        if user_count > 0:
            # Redirect to login or return an error response
            return jsonify({"success":False,"message": "Sign up is disabled because a user already exists."}), 400

        # Proceed to the decorated function if no users exist
        return f(*args, **kwargs)

    return decorated_function


def hash_password(password):
    return bcrypt.generate_password_hash(password).decode("utf-8")


def user_exists(username):
    query = "SELECT * FROM users WHERE username = %s"
    user = fetch_one(query, (username,))
    return user
