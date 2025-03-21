from sqlalchemy import create_engine, Text, Integer, ForeignKey, Boolean, DateTime, MetaData
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
import os
from dotenv import load_dotenv

class Base(DeclarativeBase):
    pass

class Positions(Base):
    __tablename__ = "Positions"
    id: Mapped[int] = mapped_column(primary_key=True)
    position: Mapped[str] = mapped_column(Text)
    created_at: Mapped[DateTime] = mapped_column(DateTime,nullable=False)

    def __init__(self, position):
        self.position = position
<<<<<<< HEAD
        self.created_at = datetime.now()
=======
>>>>>>> backend/develop

class Users(Base):
    __tablename__ = "Users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(Text)
    position: Mapped[str] = mapped_column(ForeignKey("Positions.id"))
    is_available: Mapped[bool] = mapped_column(Boolean)
    pager_id: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[DateTime] = mapped_column(DateTime)

    def __init__(self, name, position, pager_id):
        self.name = name
        self.position = position
        self.available = True
        self.pager_id = pager_id
<<<<<<< HEAD
        self.created_at = datetime.now()
=======
>>>>>>> backend/develop

class Fields(Base):
    __tablename__ = "Fields"
    id: Mapped[int] = mapped_column(primary_key=True)
    field: Mapped[str] = mapped_column(Text)
    created_at: Mapped[DateTime] = mapped_column(DateTime)

    def __init__(self, field):
        self.field = field

class DoctorsFieldsMap(Base):
    __tablename__ = "DoctorsFieldsMap"
    id: Mapped[int] = mapped_column(primary_key=True)
    doctor: Mapped[int] = mapped_column(ForeignKey("Users.id"))
    field: Mapped[int] = mapped_column(ForeignKey("Fields.id"))
    created_at: Mapped[DateTime] = mapped_column(DateTime)

    def __init__(self, doctor, field):
        self.doctor = doctor
        self.field = field
        
class Pages(Base):
    __tablename__ = "Pages"
    id: Mapped[int] = mapped_column(primary_key=True)
    room_number: Mapped[int] = mapped_column(Integer, nullable=False)
    icd_code: Mapped[str] = mapped_column(Text, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    def __init__(self, room_number, icd_code=None, description=None):
        self.room_number = room_number
        self.icd_code = icd_code
        self.description = description

load_dotenv()
user = os.getenv("POSTGRES_USER")
password = os.getenv("POSTGRES_PASS")
host = os.getenv("POSTGRES_HOST")
port = os.getenv("DATABASE_PORT")
db = os.getenv("POSTGRES_DB")

engine = create_engine(f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}")
Base.metadata.create_all(engine)