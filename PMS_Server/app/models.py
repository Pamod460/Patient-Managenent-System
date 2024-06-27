from flask_login import UserMixin
from typing import Optional
from datetime import date, datetime
import base64


class User(UserMixin):

    def __init__(self, id, username, password, is_admin):
        self.id = id
        self.username = username
        self.password = password
        self.is_admin = is_admin


class Patient:
    def __init__(
        self,
        id: Optional[int] = None,
        name: Optional[str] = None,
        birthday: Optional[date] = None,
        age: Optional[int] = None,
        contact: Optional[str] = None,
        gender: Optional[str] = None,
        photo: Optional[bytes] = None,
        registered_date: Optional[date] = None,
    ):
        self.id = id
        self.name = name
        self.birthday = birthday
        self.age = age
        self.contact = contact
        self.gender = gender
        self.photo = photo
        self.registered_date = registered_date
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "birthday": self.birthday,
            "age": self.age,
            "contact": self.contact,
            "gender": self.gender,
            "photo": self.photo,
            "registered_date": self.registered_date,
        }

    def serialize(self):
        photo_base64 = (
            base64.b64encode(self.photo).decode("utf-8") if self.photo else None
        )
        return {
            "id": self.id,
            "name": self.name,
            "photo": photo_base64,
            "age": self.age,
            "contact": self.contact,
            "gender": self.gender,
            "birthday": self.birthday.isoformat() if self.birthday else None,
            "registered_date":self.registered_date.isoformat() if self.registered_date else None,
        }


class Record:
    def __init__(
        self,
        id: Optional[int] = None,
        patient: Optional[Patient] = None,
        record_date: Optional[date] = None,
        complaints: Optional[str] = None,
        history: Optional[str] = None,
        diagnosed: Optional[str] = None,
        treatment: Optional[str] = None,
        next_review: Optional[date] = None,
        charges: Optional[float] = None,
    ):
        self.id = id
        self.patient = patient
        self.record_date = record_date
        self.complaints = complaints
        self.history = history
        self.diagnosed = diagnosed
        self.treatment = treatment
        self.next_review = next_review
        self.charges = charges
    def to_dict(self):
        return {
            "id": self.id,
            "patient": self.patient.to_dict() if self.patient else None,  # Assuming Patient class also has a to_dict method
            "record_date": self.record_date,
            "complaints": self.complaints,
            "history": self.history,
            "diagnosed": self.diagnosed,
            "treatment": self.treatment,
            "next_review": self.next_review,
            "charges": self.charges,
        }
    def serialize(self):
        return {
            "id": self.id,
            "patient": self.patient.serialize() if self.patient else None,
            "record_date": self.record_date.isoformat() if self.record_date else None,
            "complaints": self.complaints,
            "history": self.history,
            "diagnosed": self.diagnosed,
            "treatment": self.treatment,
            "next_review": self.next_review.isoformat() if self.next_review else None,
            "charges": self.charges,
        }
