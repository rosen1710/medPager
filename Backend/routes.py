# - връщане на response от backend-a за frontend-a за допълване на page-a
# - пращане на заявка от frontend към backend за пълен page

from flask import Flask, request, make_response, jsonify
from flask_cors import CORS
from sqlalchemy import select
from models import engine
from sqlalchemy.orm import Session
from models import Users, Pages
from ai_connector import get_code_from_ai

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

@app.route("/user/<doc_id>", methods=["GET"])
def toggle(doc_id):
    with Session(engine) as session:
        user = session.query(Users).filter(Users.id == doc_id).first()
    return make_response(user.name, 200)

@app.route("/unavailable/<doc_id>", methods=["POST"])
def unavailable(doc_id):
    with Session(engine) as session:
        user = session.scalar(select(Users).where(Users.id == doc_id))
        user.is_available = False
        session.commit()
    return make_response("Doctor successfully unavailable", 200)

@app.route("/available/<doc_id>", methods=["POST"])
def available(doc_id):
    with Session(engine) as session:
        user = session.scalar(select(Users).where(Users.id == doc_id))
        user.is_available = True
        session.commit()
    return make_response("Doctor successfully available", 200)

@app.route("/prompt", methods=["POST"])
def prompt():
    prompt_data = request.json.get("symptoms")
    icd_codes = get_code_from_ai(prompt_data)
    codes = ", ".join([item["code"] for item in icd_codes])
    descriptions = ", ".join([item["description"] for item in icd_codes])
    response_data = {
        "codes": codes,
        "descriptions": descriptions
    }
    return make_response(jsonify(response_data), 200)

@app.route("/call", methods=["POST"])
def call():
    data = dict(request.json)
    with Session(engine) as session:
        new_page = Pages(
            room_number=data["room_number"],
            icd_code=data["icd_code"],
            description=data["description"]
        )
        session.add(new_page) 
        session.commit()
    return make_response("Page successfully added", 200)

@app.route("/emergencies", methods=["GET"])
def emergencies():
    return make_response(jsonify(emergency_codes), 200)

@app.route("/delete_page/<page_id>", methods=["DELETE"])
def delete_page(page_id):
    with Session(engine) as session:
        page = session.query(Pages).filter(Pages.id == page_id).first()
        session.delete(page)
        session.commit()
    return make_response("Page successfully deleted", 200)

app.run(host="0.0.0.0", port=8888, debug=True)