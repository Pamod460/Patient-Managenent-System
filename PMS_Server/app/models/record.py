from datetime import date
from typing import Optional

from app.models.patient import Patient






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