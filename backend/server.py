import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException, Query, Body, Path
from fastapi.middleware.cors import CORSMiddleware
import mongodb_client
from models import LessonUpdateData, Lesson
from mongodb_client import insert_lesson, get_lessons
import pytz

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/lessons')
async def add_lesson(lesson: Lesson = Body(...)):
    lesson_data = {
        "name": lesson.name,
        "payment_date": lesson.payment_date if lesson.payment_date else None,  # Convert to date if not None
        "price": lesson.price,
        "payment": lesson.payment,
        "lesson_date": lesson.lesson_date if lesson.lesson_date else None,  # Convert to date if not None
        "payment_method": lesson.payment_method,
        "reception": lesson.reception
    }
    await insert_lesson(lesson_data)


@app.get('/lessons')
async def get_all_lessons():
    return await get_lessons()


@app.put('/lessons/{lesson_id}')
async def update_lesson(
        lesson_id: str = Path(...,description="The ID of the lesson to update"),
        data: LessonUpdateData = Body()
):
    updated_data = {
        "name": data.name,
        "payment_date": data.payment_date,
        "price": data.price,
        "payment": data.payment,
        "lesson_date": data.lesson_date,
        "payment_method": data.payment_method,
        "reception": data.reception
    }

    result = await mongodb_client.update_lesson(str(lesson_id), updated_data)


@app.get('/payment_amount')
async def get_amount_per_month_and_year(
        startDate: Optional[datetime.datetime] = None,
        endDate: Optional[datetime.datetime] = None
):
    lessons = await mongodb_client.get_lessons_by_date(startDate, endDate)
    dict_of_payment_and_payment_method = {'Bit': 0, 'Cash': 0, 'Paybox': 0, 'Bank Transfer': 0, 'No payment': 0}

    for lesson in lessons:
        payment_method = lesson['payment_method']
        payment_amount = int(lesson['payment'])

        if payment_method == "No payment":
            dict_of_payment_and_payment_method[payment_method] += int(lesson['price'])
        else:
            dict_of_payment_and_payment_method[payment_method] += payment_amount

    return dict_of_payment_and_payment_method


if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host='0.0.0.0', port=5000)
