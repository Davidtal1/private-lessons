from pydantic import BaseModel, Field
from typing import Optional
import datetime

class Lesson(BaseModel):
    name: str
    payment_date: Optional[datetime.datetime] = None
    price: Optional[int] = Field(default=0, description="The price of the lesson, must be a non-negative integer")
    payment: Optional[int] = Field(default=0, description="The payment made for the lesson, must be a non-negative integer")
    lesson_date: Optional[datetime.datetime] = None  # Lesson date in YYYY-MM-DD format
    payment_method: str  # Ensure payment method is not empty
    reception: bool



class LessonUpdateData(Lesson):
    pass
