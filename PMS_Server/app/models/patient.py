import base64
from datetime import date
from typing import Optional


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
