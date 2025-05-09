from sqlalchemy import Column, Integer, String, ForeignKey
from .database import Base
from sqlalchemy.orm import relationship
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated='auto')

class GameField(Base):
    __tablename__ = 'game_field'

    id_game_field = Column(Integer, primary_key=True, autoincrement=True)
    length = Column(Integer, nullable=False)
    width = Column(Integer, nullable=False)
    layout_array = Column(String(1000), nullable=False)
    energy = Column(Integer, nullable=False)

    task = relationship('Task', back_populates='game_field')

class Goal(Base):
    __tablename__ = 'goal'

    id_goal = Column(Integer, primary_key=True)
    text = Column(String(100), nullable=False)

    task = relationship('Task', back_populates='goal')

class Task(Base):
    __tablename__ = 'task'

    id_task = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(45), nullable=False)
    id_game_field = Column(Integer, ForeignKey('game_field.id_game_field'))
    id_goal = Column(Integer, ForeignKey('goal.id_goal'))

    game_field = relationship('GameField', back_populates='task')
    goal = relationship('Goal', back_populates='task')
    journal = relationship('Journal', back_populates='task')
    solution = relationship('Solution', back_populates='task')

class Student(Base):
    __tablename__ = 'student'

    login = Column(String(45), primary_key=True)
    name = Column(String(45))
    surname = Column(String(45))
    patronymic = Column(String(45))
    password = Column(String(100), nullable=False)
    class_name = Column('class', String(45), nullable=False)

    journal = relationship('Journal', back_populates='student')
    solution = relationship('Solution', back_populates='student')

    def verify_password(self, plain_password: str):
        return pwd_context.verify(plain_password, self.password)

class Journal(Base):
    __tablename__ = 'journal'

    id_journal = Column(Integer, primary_key=True, autoincrement=True)
    mark = Column(Integer)
    student_login = Column(String(45), ForeignKey('student.login'))
    id_task = Column(Integer, ForeignKey('task.id_task'))

    student = relationship('Student', back_populates='journal')
    task = relationship('Task', back_populates='journal')

class Solution(Base):
    __tablename__ = 'solution'

    id_solution = Column(String(45), primary_key=True, autoincrement=True)
    algorithm = Column(String(1000))
    student_login = Column(String(45), ForeignKey('student.login'))
    id_task = Column(Integer, ForeignKey('task.id_task'))

    student = relationship('Student', back_populates='solution')
    task = relationship('Task', back_populates='solution')


