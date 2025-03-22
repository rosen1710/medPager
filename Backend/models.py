from datetime import datetime
from sqlalchemy import create_engine, Text, Integer, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
import os
from dotenv import load_dotenv

class Base(DeclarativeBase):
    pass

class Positions(Base):
    __tablename__ = "Positions"
    id: Mapped[int] = mapped_column(primary_key=True)
    position: Mapped[str] = mapped_column(Text)

    def __init__(self, position):
        self.position = position

class Users(Base):
    __tablename__ = "Users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(Text)
    position: Mapped[str] = mapped_column(ForeignKey("Positions.id"))
    is_available: Mapped[bool] = mapped_column(Boolean)
    pager_id: Mapped[int] = mapped_column(Integer)

    def __init__(self, name, position, pager_id):
        self.name = name
        self.position = position
        self.available = True
        self.pager_id = pager_id

class Departments(Base):
    __tablename__ = "Departments"
    id: Mapped[int] = mapped_column(primary_key=True)
    department: Mapped[str] = mapped_column(Text)

    def __init__(self, department):
        self.department = department

class DoctorsDepartmentsMap(Base):
    __tablename__ = "DoctorsDepartmentsMap"
    id: Mapped[int] = mapped_column(primary_key=True)
    doctor: Mapped[int] = mapped_column(ForeignKey("Users.id"))
    department: Mapped[int] = mapped_column(ForeignKey("Departments.id"))

    def __init__(self, doctor, department):
        self.doctor = doctor
        self.department = department
        
class Pages(Base):
    __tablename__ = "Pages"
    id: Mapped[int] = mapped_column(primary_key=True)
    room_number: Mapped[int] = mapped_column(Integer, nullable=True)
    icd_code: Mapped[str] = mapped_column(Text, nullable=True)
    symptoms: Mapped[str] = mapped_column(Text, nullable=True)
    department: Mapped[int] = mapped_column(ForeignKey("Departments.id"), nullable=True)
    department_name: Mapped[str] = mapped_column(Text, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime)

    def __init__(self, room_number=None, icd_code=None, symptoms=None, department=None, department_name=None):
        self.room_number = room_number
        self.icd_code = icd_code
        self.symptoms = symptoms
        self.department = department
        self.department_name = department_name
        self.created_at = datetime.now()

load_dotenv()
user = os.getenv("POSTGRES_USER")
password = os.getenv("POSTGRES_PASS")
host = os.getenv("POSTGRES_HOST")
port = os.getenv("DATABASE_PORT")
db = os.getenv("POSTGRES_DB")

engine = create_engine(f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}")
Base.metadata.create_all(engine)