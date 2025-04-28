from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models
from ..database import get_db

router = APIRouter(prefix='/tasks', tags=['tasks'])

@router.get('/', response_model=List[schemas.TaskResponse])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Task).offset(skip).limit(limit).all()

@router.get('/{task_id}', response_model=schemas.TaskResponse)
def read_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id_task == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail='Задание не найдено')
    return task