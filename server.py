from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# Replace with your MongoDB connection string
app.config["MONGO_URI"] = "mongodb://localhost:27017/private_lesson"
mongo = PyMongo(app)

@app.route('/add_lesson', methods=['POST'])
def add_lesson():
    data = request.json

    def extract_date(iso_string):
        if iso_string:
            return iso_string.split('T')[0]
        return None

    document = {
        "name": data["textValues"]["name"],
        "date": extract_date(data["selectedDate"]["date"]),
        "price": int(data["textValues"]["price"]),
        "payment": int(data["textValues"]["payment"]),
        "lessondate": extract_date(data["selectedDate"]["lessondate"]),
        "payment_method": data["radioValue"],
        "reception": data["reception"]
    }

    result = mongo.db.lessons.insert_one(document)
    return jsonify({"message": "Document inserted", "id": str(result.inserted_id)}), 201

@app.route('/get_lessons', methods=['GET'])
def get_lessons():
    lessons = mongo.db.lessons.find()
    lessons_list = []
    for lesson in lessons:
        lesson['_id'] = str(lesson['_id'])  # Convert ObjectId to string
        lessons_list.append(lesson)
    return jsonify(lessons_list), 200

@app.route('/update_lesson/<id>', methods=['PUT'])
def update_lesson(id):
    data = request.json

    def extract_date(iso_string):
        if iso_string:
            return iso_string.split('T')[0]
        return None

    updated_data = {
        "name": data["name"],
        "date": extract_date(data["date"]),
        "price": int(data["price"]),
        "payment": int(data["payment"]),
        "lessondate": extract_date(data["lessondate"]),
        "payment_method": data["payment_method"],
        "reception": data["reception"]
    }

    result = mongo.db.lessons.update_one({"_id": ObjectId(id)}, {"$set": updated_data})
    if result.matched_count > 0:
        return jsonify({"message": "Document updated"}), 200
    else:
        return jsonify({"message": "Document not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
