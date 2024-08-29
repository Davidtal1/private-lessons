import datetime
from typing import Dict, Any

from bson import ObjectId
from pymongo import MongoClient

from settings import settings

client = MongoClient(settings.mongodb_uri)
db = client.private_lesson
lessons_collection = db.lessons


async def update_lesson(lesson_id: str, updated_data: Dict):
    lessons_collection.update_one({"_id": ObjectId(lesson_id)}, {"$set": updated_data})


async def insert_lesson(lesson: Dict[str, Any]):
    lessons_collection.insert_one(lesson)


async def get_lessons():
    lessons = list(lessons_collection.find())
    for lesson in lessons:
        lesson["_id"] = str(lesson["_id"])
    return lessons


async def get_lessons_by_date(start_date: datetime.datetime, end_date: datetime.datetime):
    return list(lessons_collection.find({"lesson_date": {"$lt": end_date, "$gte": start_date}}))
