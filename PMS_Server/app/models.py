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


class Record:
    def __init__(
        self,
        id: Optional[int] = None,
        patient_id: Optional[int] = None,
        record_date: Optional[date] = None,
        complaints: Optional[str] = None,
        history: Optional[str] = None,
        diagnosed: Optional[str] = None,
        treatment: Optional[str] = None,
        next_review: Optional[date] = None,
        charges: Optional[float] = None,
    ):
        self.id = id
        self.patient_id = patient_id
        self.record_date = record_date
        self.complaints = complaints
        self.history = history
        self.diagnosed = diagnosed
        self.treatment = treatment
        self.next_review = next_review
        self.charges = charges

    def serialize(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "record_date": self.record_date.isoformat() if self.record_date else None,
            "complaints": self.complaints,
            "history": self.history,
            "diagnosed": self.diagnosed,
            "treatment": self.treatment,
            "next_review": self.next_review.isoformat() if self.next_review else None,
            "charges": self.charges,
        }

# Example usage
record = Record(
    id=1,
    patient_id=123,
    record_date=date(2024, 6, 19),
    complaints="Fever and cough",
    history="No prior history of chronic illness",
    diagnosed="Viral infection",
    treatment="Paracetamol and rest",
    next_review=date(2024, 6, 26),
    charges=150.0
)


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
        self.age = age
        self.birthday = birthday
        self.contact = contact
        self.gender = gender
        self.id = id
        self.name = name
        self.photo = photo
        self.registered_date = registered_date

    def serialize(self):
        if isinstance(self.photo, bytes):
            photo_base64 = base64.b64encode(self.photo).decode("utf-8")
        else:
            photo_base64 = None

        return {
            "id": self.id,
            "name": self.name,
            "photo": photo_base64,
            "age": self.age,
            "contact": self.contact,
            "gender": self.gender,
            "birthday": self.birthday,
            "registered_date": self.registered_date,
        }
