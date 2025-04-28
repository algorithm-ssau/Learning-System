from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models
from ..database import get_db

router = APIRouter(prefix='/students', tags=['students'])


@router.post('/', response_model=schemas.StudentResponse)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = models.Student(**student.dict())
    db.add(db_student)
    try:
        db.commit()
        db.refresh(db_student)
        return db_student
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get('/', response_model=List[schemas.StudentResponse])
def read_students(skip: int = 0, limit: int = 100000, db: Session = Depends(get_db)):
    return db.query(models.Student).offset(skip).limit(limit).all()

@router.get("/{login}/tasks", response_model=List[dict])
def get_student_tasks(login: str, db: Session = Depends(get_db)):
    tasks = db.query(
        models.Task.name.label("task_name"),
        models.Journal.mark.label("task_mark")
    ).join(
        models.Journal,
        models.Journal.id_task == models.Task.id_task
    ).filter(
        models.Journal.student_login == login
    ).all()

    if not tasks:
        raise HTTPException(status_code=404, detail="Не найден ученик или у данного ученика нет заданий")

    return [{"task_name": task.task_name, "task_mark": task.task_mark} for task in tasks]

@router.get('/{login}', response_model=schemas.StudentResponse)
def read_student(login: str, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.login == login).first()
    if not student:
        raise HTTPException(status_code=404, detail='Студент не найден')