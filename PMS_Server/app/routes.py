from typing import Optional, Union
from flask import request, render_template, redirect, session, url_for, jsonify, flash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_jwt_identity,
    jwt_required,
    verify_jwt_in_request,
)
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.utils import secure_filename
from datetime import date
import os
import base64
import re
from app import app, mysql, login_manager, bcrypt
from app.models.patient import Patient
from app.models.record import Record
from app.models.user import User
from app.utils import check_users_existence, hash_password, user_exists
from app.db import fetch_one, fetch_all, execute_query
from datetime import datetime, timedelta
from functools import wraps

from flask import Flask, jsonify, request


@app.before_request
def before_request():
    session.permanent = True
    session.modified = True


# @app.route("/protected", methods=["GET"])
# @jwt_required()
# def protected():
#     current_user = get_jwt_identity()
#     return jsonify(logged_in_as=current_user), 200


# User loading functions
@login_manager.user_loader
def load_user(user_id):
    query = "SELECT * FROM users WHERE id = %s"
    user = fetch_one(query, (user_id,))
    if user:
        return User(user["id"], user["username"], user["password"], user["is_admin"])
    return None


def load_user_by_username(username):
    query = "SELECT * FROM users WHERE username = %s"
    user = fetch_one(query, (username,))
    print(f"Debug: Retrieved user data: {user}")
    if user is None:
        return None
    try:
        return User(user["id"], user["username"], user["password"], user["is_admin"])
    except IndexError as e:
        print(f"Debug: IndexError - {e}")
        # Handle the error or return None, or raise a custom exception
        return None
    except KeyError as e:
        print(f"Debug: KeyError - {e}")
        # Handle the error or return None, or raise a custom exception
        return None


# Admin required decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        verify_jwt_in_request()  # Ensure JWT is valid
        current_user = load_user_by_username(
            get_jwt_identity()
        )  # Load the current user
        print(current_user)
        if not current_user or not current_user.is_admin:
            return (
                jsonify({"message": "You do not have permission to access this page."}),
                403,
            )
        return f(*args, **kwargs)

    return decorated_function


@app.route("/has_users", methods=["GET"])
def has_users():
    query = "SELECT count(username) as count FROM users"
    user_count = fetch_one(query)
    return jsonify({"has_users": user_count["count"] >= 1})


@app.route("/regexes", methods=["POST"])
def validate_phone():
    phone_number = request.form["phone_number"]
    pattern = re.compile(r"^(?:0|94|\+94)?(7[0-9]{8})$")
    if pattern.match(phone_number):
        return jsonify(valid=True)
    else:
        return jsonify(valid=False)


def save_user(username, password, is_admin=False):
    hashed_password = hash_password(password)
    query = "INSERT INTO users (username, password, is_admin) VALUES (%s, %s, %s)"
    execute_query(query, (username, hashed_password, is_admin))


@app.route("/signup", methods=["POST"])
@check_users_existence
def signup():

    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")

    if password != confirm_password:
        return (
            jsonify({"success": False, "message": "Passwords do not match!"}),
            400,
        )

    if user_exists(username):
        return jsonify({"success": False, "message": "User already exists!"}), 400

    save_user(username, password, True)

    return (
        jsonify(
            {
                "success": True,
                "message": "Account created successfully! You can now log in.",
            }
        ),
        200,
    )


@app.route("/forgot_password", methods=["GET", "POST"])
def forgot_password():
    if request.method == "POST":
        username = request.form["username"]
        security_answer = request.form["security_answer"]
        user = fetch_one("SELECT * FROM users WHERE username = %s", (username,))

        if user and bcrypt.check_password_hash(user[4], security_answer):
            # Redirect to the reset password form
            return redirect(url_for("reset_password", username=username))
        else:
            flash("Invalid username or security answer.", "danger")

    return render_template("forgot_password.html")


# user module
@app.route("/users", methods=["GET", "POST"])
@jwt_required()
@admin_required
def users():
    if request.method == "POST":
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        if password != confirm_password:
            return (
                jsonify({"success": False, "message": "Passwords do not match!"}),
                400,
            )
        elif user_exists(username):
            return jsonify({"success": False, "message": "User already exists!"}), 400
        else:
            save_user(username, password, is_admin=False)
            return (
                jsonify({"success": True, "message": "User added successfully!"}),
                201,
            )

    elif request.method == "GET":
        query = "SELECT * FROM users"
        users = fetch_all(query)
        return jsonify(users=users), 200


@app.route("/users/<int:user_id>", methods=["GET", "PUT", "DELETE"])
@jwt_required()
@admin_required
def modify_user(user_id):
    if request.method == "GET":
        query = "SELECT * FROM users WHERE id = %s"
        user = fetch_one(query, (user_id,))
        if user:
            return jsonify(user=user), 200
        else:
            return jsonify({"message": "User not found."}), 404

    elif request.method == "PUT":
        data = request.get_json()
        update_fields = []
        update_values = []

        allowed_fields = ["username", "password"]
        for field in allowed_fields:
            if field in data:
                update_fields.append(f"{field} = %s")
                if field == "password":
                    update_values.append(hash_password(data[field]))
                else:
                    update_values.append(data[field])

        if update_fields:
            query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = %s"
            update_values.append(user_id)
            execute_query(query, tuple(update_values))
            return jsonify({"message": "User updated successfully!"}), 200
        else:
            return jsonify({"message": "No valid fields provided for update."}), 400

    elif request.method == "DELETE":
        try:
            query = "DELETE FROM users WHERE id = %s"
            execute_query(query, (user_id,))
            return jsonify({"message": "User deleted successfully!"}), 200
        except Exception as e:
            return jsonify({"message": str(e)}), 500


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = user_exists(username)

    if user and bcrypt.check_password_hash(user["password"], password):
        # Assuming User model has id, username, password, and is_admin attributes
        user_obj = User(
            user["id"], user["username"], user["password"], user["is_admin"]
        )
        login_user(user_obj)
        access_token = create_access_token(identity=username)
        refresh_token = create_refresh_token(identity=username)
        return jsonify(
            {"access_token": access_token, "refresh_token": refresh_token, "user": user}
        )
    else:
        flash("Login Unsuccessful. Please check username and password", "danger")
        return jsonify({"error": "Invalid username or password"}), 401


@app.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    try:
        # Get the current user's identity
        identity = get_jwt_identity()

        # Create a new access token
        access_token = create_access_token(identity=identity)

        return jsonify(access_token=access_token), 200

    except Exception as e:
        return jsonify({"msg": "An error occurred", "error": str(e)}), 500


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))


# patient module
@app.route("/patients", methods=["GET", "POST"])
@jwt_required()
def patients():
    try:
        if request.method == "POST":
            data = request.get_json()
            name = data.get("name")
            birthday = extract_date_from_datetime(data.get("birthday"))
            age = data.get("age")
            gender = data.get("gender")
            contact = data.get("contact")
            photo_data = data.get("photo")
            registered_date = extract_date_from_datetime(data.get("registered_date"))
            query = "INSERT INTO patients (name, birthday, age, gender, contact, photo, registered_date) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            execute_query(
                query,
                (name, birthday, age, gender, contact, photo_data, registered_date),
            )
            return jsonify({"message": "Patient added successfully!"}), 201

        elif request.method == "GET":
            query = "SELECT * FROM patients"
            patients_data = fetch_all(query)
            patients = create_patient_objects(patients_data)
            return jsonify(patients=[patient.serialize() for patient in patients]), 200
    except Exception as e:
        print(f"Error fetching patients: {str(e)}")
        return jsonify({"error": "Failed to fetch patients"}), 500


def create_patient_objects(patient_data):
    # Check if patient_data is not a list (single patient case)
    if isinstance(patient_data, dict):
        patient_data = [patient_data]

    patients = []
    for data in patient_data:
        patient = Patient(
            id=data["id"],
            name=data["name"],
            photo=data["photo"],  # Assign BLOB data directly
            age=data.get("age"),  # Optional fields
            contact=data.get("contact"),
            gender=data.get("gender"),
            birthday=data.get("birthday"),
            registered_date=data.get("registered_date"),
        )
        patients.append(patient)
    return patients


def create_record_objects(record_data):
    # Check if record_data is not a list (single record case)
    if isinstance(record_data, dict):
        record_data = [record_data]

    records = []
    for data in record_data:
        record = Record(
            id=data.get("id"),
            patient=get_patient_by_id(int(data.get("patient_id"))),
            record_date=data.get("record_date"),
            complaints=data.get("complaints"),
            history=data.get("history"),
            diagnosed=data.get("diagnosed"),
            treatment=data.get("treatment"),
            next_review=data.get("next_review"),
            charges=data.get("charges"),
        )
        records.append(record)
    return records


@app.route("/patients/<int:patient_id>", methods=["GET", "PUT", "DELETE"])
@jwt_required()
def modify_patient(patient_id):
    if request.method == "GET":
        query = "SELECT * FROM patients WHERE id = %s"
        patient = fetch_one(query, (patient_id,))
        patient = create_patient_objects(patient)

        if patient:
            return jsonify(patient[0].serialize()), 200
        else:
            return jsonify({"message": "Patient not found."}), 404

    elif request.method == "PUT":
        data = request.get_json()
        update_fields = []
        update_values = []

        allowed_fields = ["name", "birthday", "age", "gender", "contact", "photo"]
        for field in allowed_fields:
            if field in data:
                if field != "birthday":
                    update_fields.append(f"{field} = %s")
                    update_values.append(data[field])
                else:
                    update_fields.append(f"{field} = %s")
                    update_values.append(extract_date_from_datetime(data[field]))
        if update_fields:
            query = f"UPDATE patients SET {', '.join(update_fields)} WHERE id = %s"
            update_values.append(patient_id)
            execute_query(query, tuple(update_values))
            return jsonify({"message": "Patient updated successfully!"}), 200
        else:
            return jsonify({"message": "No valid fields provided for update."}), 400

    elif request.method == "DELETE":
        try:
            query = "DELETE FROM patients WHERE id = %s"
            execute_query(query, (patient_id,))
            return jsonify({"message": "Patient deleted successfully!"}), 200
        except Exception as e:
            return jsonify({"message": str(e)}), 500


def get_patient_by_id(patient_id: int):
    query = "SELECT * FROM patients WHERE id = %s"
    patient_record = fetch_one(query, (patient_id,))
    if patient_record:
        patient = Patient(
            id=patient_record.get("id"),
            name=patient_record.get("name"),
            birthday=patient_record.get("birthday"),
            age=patient_record.get("age"),
            contact=patient_record.get("contact"),
            gender=patient_record.get("gender"),
            photo=patient_record.get("photo"),
            registered_date=patient_record.get("registered_date"),
        )
        return patient
    return None


def extract_date_from_datetime(datetime_str):
    if datetime_str:
        dt = datetime.fromisoformat(
            datetime_str.split("T")[0],
        )  # Convert to datetime object
        return dt.date()


# records module
@app.route("/records", methods=["GET", "POST"])
@jwt_required()
def medical_records():
    # current_user = get_jwt_identity()
    print(current_user)
    if request.method == "POST":
        data = request.get_json()
        record_date = data.get("record_date").split("T")[0]
        complaints = data.get("complaints")
        history = data.get("history")
        diagnosed = data.get("diagnosed")
        treatment = data.get("treatment")
        patient_id = data.get("patient_id")
        next_review = extract_date_from_datetime(data.get("next_review"))
        charges = data.get("charges")

        query = "INSERT INTO medical_records (patient_id, record_date, complaints, history, diagnosed, treatment, next_review, charges) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        execute_query(
            query,
            (
                patient_id,
                record_date,
                complaints,
                history,
                diagnosed,
                treatment,
                next_review,
                charges,
            ),
        )
        return jsonify({"message": "Record added successfully!"}), 201

    elif request.method == "GET":
        query = "SELECT * FROM medical_records"
        records = fetch_all(query)
        record_objects = create_record_objects(records)
        return jsonify(records=[record.serialize() for record in record_objects]), 200


def dynamic_insert(table, data):
    columns = ", ".join(data.keys())
    placeholders = ", ".join(["%s"] * len(data))
    query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
    execute_query(query, tuple(data.values()))


@app.route("/records/<int:record_id>", methods=["GET", "PUT", "DELETE"])
@jwt_required()
def modify_record(record_id):
    if request.method == "GET":
        query = "SELECT * FROM medical_records WHERE id = %s"
        record = fetch_all(query, (record_id,))
        if record is not None:
            record = create_record_objects(record)
            if record:
                return jsonify(record[0].serialize()), 200
        else:
            return jsonify({"message": "Record not found."}), 404

    elif request.method == "PUT":
        data = request.get_json()
        update_fields = []
        update_values = []

        allowed_fields = [
            "record_date",
            "complaints",
            "history",
            "diagnosed",
            "treatment",
            "next_review",
            "charges",
        ]
        for field in allowed_fields:
            if field in data:
                print(field)
                if field == "record_date" or field == "next_review":
                    try:
                        # Parsing date fields to ensure proper format
                        date_value = datetime.fromisoformat(data[field]).date()
                        update_fields.append(f"{field} = %s")
                        update_values.append(date_value)
                    except ValueError:
                        return (
                            jsonify({"message": f"Invalid date format for {field}."}),
                            400,
                        )
                else:
                    update_fields.append(f"{field} = %s")
                    update_values.append(data[field])

        if update_fields:
            query = (
                f"UPDATE medical_records SET {', '.join(update_fields)} WHERE id = %s"
            )
            update_values.append(record_id)
            execute_query(query, tuple(update_values))
            return jsonify({"message": "Record updated successfully!"}), 200
        else:
            return jsonify({"message": "No valid fields provided for update."}), 400

    elif request.method == "DELETE":
        try:
            query = "DELETE FROM medical_records WHERE id = %s"
            execute_query(query, (record_id,))
            return jsonify({"message": "Record deleted successfully!"}), 200
        except Exception as e:
            return jsonify({"message": str(e)}), 500


@app.route("/add_record/<int:patient_id>", methods=["GET", "POST"])
@jwt_required()
def add_record(patient_id):
    if request.method == "POST":
        record_date = request.form["record_date"]
        complaints = request.form["complaints"]
        history = request.form["history"]
        diagnosed = request.form["diagnosed"]
        treatment = request.form["treatment"]
        next_review = request.form["next_review"]
        charges = request.form["charges"]
        query = "INSERT INTO medical_records (patient_id, record_date, complaints, history, diagnosed, treatment, next_review, charges) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        execute_query(
            query,
            (
                patient_id,
                record_date,
                complaints,
                history,
                diagnosed,
                treatment,
                next_review,
                charges,
            ),
        )
        return redirect(url_for("index"))
    return render_template("add_record.html", patient_id=patient_id)


def fetch_daily_report():

    today = date.today()

    query = "SELECT p.name AS patient_name , charges FROM pms_db.patients p INNER JOIN pms_db.medical_records mr ON p.id = mr.patient_id WHERE record_date = %s"

    records = fetch_all(
        query,
        (today,),
    )

    return records


@app.route("/get_chart_data")
@jwt_required()
def get_chart_data():
    try:

        query = "SELECT DATE(record_date) as record_date, COUNT(*) as patient_count FROM medical_records WHERE record_date >= CURDATE() - INTERVAL 7 DAY GROUP BY DATE(record_date) ORDER BY record_date;"
        patient_counts_data = fetch_all(query)

        query = "SELECT DATE(record_date) as record_date, SUM(charges) as total_income FROM medical_records WHERE record_date >= CURDATE() - INTERVAL 7 DAY GROUP BY DATE(record_date) ORDER BY record_date;"
        income_data = fetch_all(query)

        labels = [
            record["record_date"].strftime("%Y-%m-%d") for record in patient_counts_data
        ]
        patient_counts = [record["patient_count"] for record in patient_counts_data]
        income = [record["total_income"] for record in income_data]

        record_dates = {
            record["record_date"].strftime("%Y-%m-%d"): record["patient_count"]
            for record in patient_counts_data
        }
        income_dates = {
            record["record_date"].strftime("%Y-%m-%d"): record["total_income"]
            for record in income_data
        }

        for i, label in enumerate(labels):
            if label in record_dates:
                patient_counts[i] = record_dates[label]
            if label in income_dates:
                income[i] = income_dates[label]

        data = {"labels": labels, "patientCounts": patient_counts, "income": income}

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)})


def get_total_charges():
    today = date.today()
    query = "SELECT SUM(charges) as total FROM medical_records WHERE record_date = %s"
    t = fetch_one(query, (today,))
    return t


@app.route("/daily_report")
@jwt_required()
def get_daily_report():
    records = fetch_daily_report()
    total = get_total_charges()

    if records is not None and total is not None:
        data = {"records": records, "total": total}
        return jsonify(data), 200
    return jsonify({"error": "Could not fetch the daily report"}), 404
