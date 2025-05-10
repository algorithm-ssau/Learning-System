from pydantic import BaseModel
from typing import Optional, List

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


class GameFieldBase(BaseModel):
    height: int
    width: int
    layout_array: str
    energy: int

class GameFieldCreate(GameFieldBase):
    pass

class GameFieldResponse(GameFieldBase):
    id_game_field: int

    class Config:
        orm_mode = True

class GameFieldResponse(BaseModel):
    id_game_field: int
    height: int
    width: int
    layout_array: str
    energy: int

    class Config:
        orm_mode = True


class TaskCreate(BaseModel):
    name: str
    id_game_field: int
    id_goal: int

    class Config:
        orm_mode = True

class TaskResponse(TaskCreate):
    id_task: int

    class Config:
        orm_mode = True

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

class JournalCreate(BaseModel):
    mark: Optional[int] = None
    student_login: str
    id_task: int

    class Config:
        orm_mode = True

class StudentResponse(StudentBase):
    journals: List['JournalResponse'] = []
    solutions: List['SolutionResponse'] = []

class TaskResponse(TaskBase):
    game_field: 'GameFieldResponse'
    goal: 'GoalResponse'
    journals: List['JournalResponse'] = []
    solutions: List['SolutionResponse'] = []

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

class SolutionBase(BaseModel):
    student_login: str
    id_task: int
    algorithm: str

    class Config:
        orm_mode = True

class SolutionCreate(SolutionBase):
    pass

class SolutionSubmission(BaseModel):
    submission: SolutionBase

class SolutionResponse(BaseModel):
    algorithm: Optional[str] = None
    student_login: str
    id_task: int

    class Config:
        orm_mode = True

StudentResponse.update_forward_refs()
TaskResponse.update_forward_refs()
