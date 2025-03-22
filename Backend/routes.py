from flask import Flask, request, make_response, jsonify
from flask_cors import CORS
from sqlalchemy import select
from queue import Queue
from sqlalchemy.orm import Session
from models import engine, Users, Pages, DoctorsDepartmentsMap
from ai_connector import get_code_from_ai
import auth

queue = Queue()

emergency_codes = {
    "Black": "someone is armed and a threat",
    "Gray": "unarmed but a threath",
    "Blue": "life-threatening medical emergency",
    "Brown": "external emergency",
    "Orange": "evacuation",
    "Purple": "bomb threat",
    "Red": "fire",
    "Yellow": "internal emergency",
    "MET": "close to code blue",
    "Pink": "unexpected labor unexpectedly or a newborn medical emergency"
}

app = Flask(__name__)
CORS(app)

# @app.route("/user/<doc_id>", methods=["GET"])
# def toggle(doc_id):
#     with Session(engine) as session:
#         user = session.query(Users).filter(Users.id == doc_id).first()
#     return make_response(user.name, 200)

@app.route("/unavailable/<doc_id>", methods=["POST"])
def unavailable(doc_id):
    data = dict(request.json)

    parsed_token = auth.parse_token(data["token"])
    if not auth.is_token_active(parsed_token):
        return make_response({"message": "Unauthorized"}, 401)

    with Session(engine) as session:
        user = session.scalar(select(Users).where(Users.id == doc_id))
        user.is_available = False
        session.commit()
    return make_response("Doctor successfully unavailable", 200)

@app.route("/available/<doc_id>", methods=["POST"])
def available(doc_id):
    data = dict(request.json)

    parsed_token = auth.parse_token(data["token"])
    if not auth.is_token_active(parsed_token):
        return make_response({"message": "Unauthorized"}, 401)

    with Session(engine) as session:
        user = session.scalar(select(Users).where(Users.id == doc_id))
        user.is_available = True
        session.commit()
    return make_response("Doctor successfully available", 200)

@app.route("/prompt", methods=["POST"])
def prompt():
    data = dict(request.json)

    parsed_token = auth.parse_token(data["token"])
    if not auth.is_token_active(parsed_token):
        return make_response({"message": "Unauthorized"}, 401)

    prompt_data = data.get("symptoms")

    icd_data = get_code_from_ai(prompt_data)

    # codes = ", ".join([item["code"] for item in icd_data])
    # descriptions = ", ".join([item["description"] for item in icd_data])
    # response_data = {
    #     "codes": codes,
    #     "descriptions": descriptions
    # }
    response_data = {
        "code": icd_data[0]["code"],
        "department": icd_data[0]["department"],
        "description": icd_data[0]["description"]
    }
    return make_response(jsonify(response_data), 200)

@app.route("/create_page", methods=["POST"])
def create_page():
    data = dict(request.json)

    parsed_token = auth.parse_token(data["token"])
    if not auth.is_token_active(parsed_token):
        return make_response({"message": "Unauthorized"}, 401)

    with Session(engine) as session:
        new_page = Pages(
            icd_code=data["icd_code"],
            room_number=data.get("room_number", None),
            symptoms=data.get("symptoms", None),
            department_name=data.get("department", None)
        )
        session.add(new_page) 
        session.commit()
        if new_page.room_number is not None:
            queue.put(f"{new_page.department_name}\n{new_page.icd_code} in R. {new_page.room_number}")
        else:
            queue.put(f"{new_page.department_name}\n{new_page.icd_code} emergency")
    return make_response("Page successfully added", 200)

@app.route("/get_pages", methods=["GET"])
def get_all_pages():
    with Session(engine) as session:
        pages = session.query(Pages).all()
        response_data = []
        for page in pages:
            response_data.append({
                "id": page.id,
                "room_number": page.room_number,
                "icd_code": page.icd_code,
                "symptoms": page.symptoms
            })
    return make_response(response_data, 200)

@app.route("/get_page_by_doc/<doc_id>", methods=["GET"])
def get_page(doc_id):
    with Session(engine) as session:
        doctor = session.query(DoctorsDepartmentsMap).filter(DoctorsDepartmentsMap.doctor == doc_id).first()
        pages = session.query(Pages).filter(Pages.department == doctor.department).all()
        response_data = []
        print(pages)
        for page in pages:
            response_data.append({
                "id": page.id,
                "room_number": page.room_number,
                "icd_code": page.icd_code,
                "symptoms": page.symptoms
            })
    return make_response(response_data, 200)

# @app.route("/delete_page/<page_id>", methods=["DELETE"])
# def delete_page(page_id):
#     with Session(engine) as session:
#         page = session.query(Pages).filter(Pages.id == page_id).first()
#         session.delete(page)
#         session.commit()
#     return make_response("Page successfully deleted", 200)

@app.route("/emergencies", methods=["GET"])
def emergencies():
    return make_response(jsonify(emergency_codes), 200)

@app.route("/get_all_emergencies", methods=["GET"])
def get_all_emergencies():
    with Session(engine) as session:
        pages = session.query(Pages).all()
        response_data = []
        for page in pages:
            if(page.emergency_code != None):
                response_data.append({
                    "id": page.id,
                    "room_number": page.room_number,
                    "icd_code": page.icd_code,
                    "symptoms": page.symptoms
                })
    return make_response(response_data, 200)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)