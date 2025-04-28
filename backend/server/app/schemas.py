from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class StudentBase(BaseModel):
    login: str
    name: Optional[str] = None
    surname: Optional[str] = None
    patronymic: Optional[str] = None
    class_name: str
    password: str

    class Config:
        orm_mode = True
        fields = {'class_name': 'class'}
class TaskBase(BaseModel):
    id_task: int
    name: str
    id_game_field: int
    id_goal: int

    class Config:
        orm_mode = True

class StudentCreate(StudentBase):
    pass

class TaskCreate(TaskBase):
    pass

class StudentResponse(StudentBase):
    journals: List['JournalResponse'] = []
    solutions: List['SolutionResponse'] = []

class TaskResponse(TaskBase):
    game_field: 'GameFieldResponse'
    goal: 'GoalResponse'
    journals: List['JournalResponse'] = []
    solutions: List['SolutionResponse'] = []

class GameFieldResponse(BaseModel):
    id_game_field: int
    length: int
    width: int
    layout_array: str
    energy: int

    class Config:
        orm_mode = True

class GoalResponse(BaseModel):
    id_goal: int
    text: str

    class Config:
        orm_mode = True

class JournalResponse(BaseModel):
    id_journal: int
    mark: Optional[int] = None
    student_login: str
    id_task: int

    class Config:
        orm_mode = True

class SolutionResponse(BaseModel):
    id_solution: str
    algorithm: Optional[str] = None
    student_login: str
    id_task: int

    class Config:
        orm_mode = True

StudentResponse.update_forward_refs()
TaskResponse.update_forward_refs()
