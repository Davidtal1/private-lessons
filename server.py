from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# Replace with your MongoDB connection string
app.config["MONGO_URI"] = "mongodb://localhost:27017/private_lesson"
mongo = PyMongo(app)

def get_lessons():
    lessons = mongo.db.lessons.find()
    all_lessons_list = []
    for lesson in lessons:
        lesson['_id'] = str(lesson['_id'])  
        all_lessons_list.append(lesson)
    return all_lessons_list

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
        "price": int(data["textValues"].get("price", 0)) if data["textValues"].get("price") else 0,
        "payment": int(data["textValues"].get("payment", 0)) if data["textValues"].get("payment") else 0,
        "lessondate": extract_date(data["selectedDate"]["lessondate"]),
        "payment_method": data["radioValue"],
        "reception": data["reception"]
    }

    result = mongo.db.lessons.insert_one(document)
    return jsonify({"message": "Document inserted", "id": str(result.inserted_id)}), 201

@app.route('/get_lessons', methods=['GET'])
def get_all_lessons():
    lessons_list=get_lessons()
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
        "payment": int(data.get("payment", 0)) if data.get("payment") else 0,
        "lessondate": extract_date(data["lessondate"]),
        "payment_method": data["payment_method"],
        "reception": data["reception"]
    }

    result = mongo.db.lessons.update_one({"_id": ObjectId(id)}, {"$set": updated_data})
    if result.matched_count > 0:
        return jsonify({"message": "Document updated"}), 200
    else:
        return jsonify({"message": "Document not found"}), 404
    
@app.route('/get_amount', methods=['GET'])
def get_amount_per_month_and_year():
    sum=0
    month = int(request.args.get('currentMonth'))
    year = int(request.args.get('currentYear'))
    lesson_list = get_lessons()
    filter_list=[]
    dict_of_payment_and_payment_method={'Bit':0,'Cash': 0,'Paybox': 0,'Bank Transfer': 0,'Nopayment':0}
    for lesson in lesson_list:
        if ((int(lesson["lessondate"].split('-')[0]) == year) and (int(lesson["lessondate"].split('-')[1])== month)):
            filter_list.append(lesson)

    for filter_item in filter_list:
        payment_method = filter_item['payment_method']
        payment_amount = int(filter_item['payment'])
        
        if payment_method == "Nopayment":
            dict_of_payment_and_payment_method[payment_method] += int(filter_item['price'])
        else:
            dict_of_payment_and_payment_method[payment_method] += payment_amount

    return jsonify(dict_of_payment_and_payment_method) 

if __name__ == '__main__':
    app.run(debug=True)
