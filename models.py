from sqlalchemy import Text, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from datetime import datetime

class Base(DeclarativeBase):
    pass

class Users(Base):
    __tablename__ = "Users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(Text)
    position: Mapped[str] = mapped_column(ForeignKey("Positions.id"))
    is_available: Mapped[bool] = mapped_column(Boolean)
    created_at: Mapped[DateTime] = mapped_column(DateTime)

    def __init__(self, name, position):
        self.name = name
        self.position = position
        self.available = True
        self.created_at = datetime.now()

class Positions(Base):
    __tablename__ = "Position"
    id: Mapped[int] = mapped_column(primary_key=True)
    position: Mapped[str] = mapped_column(Text)
    created_at: Mapped[DateTime] = mapped_column(DateTime)

    def __init__(self, position):
        self.position = position
        self.created_at = datetime.now()

class Fields(Base):
    __tablename__ = "Fields"
    id: Mapped[int] = mapped_column(primary_key=True)
    field: Mapped[str] = mapped_column(Text)
    created_at: Mapped[DateTime] = mapped_column(DateTime)

    def __init__(self, field):
        self.field = field
        self.created_at = datetime.now()

class DoctorsFieldsMap(Base):
    __tablename__ = "DoctorsFieldsMap"
    id: Mapped[int] = mapped_column(primary_key=True)
    doctor: Mapped[int] = mapped_column(ForeignKey("Users.id"))
    field: Mapped[int] = mapped_column(ForeignKey("Fields.id"))
    created_at: Mapped[DateTime] = mapped_column(DateTime)

    def __init__(self, doctor, field):
        self.doctor = doctor
        self.field = field
        self.created_at = datetime.now()
        