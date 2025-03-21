# - log in 
# - log out 
# - availability toggle
# - заявка от frontend към backend за page с номер на стая и icd-10 код или описание на проблем
# - заявка от backend към chat api за взимане на описание или icd-10 код 
# - връщане на response от backend-a за frontend-a за допълване на page-a
# - пращане на заявка от frontend към backend за пълен page
# - пращане на page от backend към pager със стаята и icd-10 кода
# - ще караме ли чата да мисли кой page за кое отделение е
# - заявка от frontend към backend за взимане на page-ове (ти сортираш спрямо кое отделение са)
# - изтриване на page

from flask import Flask, request, make_response
from flask_cors import CORS
from models import engine
from sqlalchemy.orm import Session
from models import Users

app = Flask(__name__)
CORS(app)

@app.route("/user/<doc_id>", methods=["GET"])
def toggle(doc_id):
    with Session(engine) as session:
        user = session.query(Users).filter(Users.id == doc_id).first()
    return make_response(user.name, 200)

@app.route("/unavaialble/<doc_id>", methods=["POST"])
def unavailable(doc_id):
    with Session(engine) as session:
        user = session.query(Users).filter(Users.id == doc_id).first()
        user.is_available = False
    return make_response("Doctor successfully unavailable", 200)

@app.route("/avaialble/<doc_id>", methods=["POST"])
def available(doc_id):
    with Session(engine) as session:
        user = session.query(Users).filter(Users.id == doc_id).first()
        user.is_available = True
    return make_response("Doctor successfully available", 200)
