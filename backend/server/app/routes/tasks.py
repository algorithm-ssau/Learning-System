from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..auth import require_teacher
from .. import schemas, models
from ..database import get_db

router = APIRouter(prefix='/tasks', tags=['tasks'])

@router.get('/', response_model=List[schemas.TaskResponse])
def read_tasks(skip: int = 0, limit: int = 100000, db: Session = Depends(get_db), _ = Depends(require_teacher)):
    try:
        print("Attempting to query tasks...")  # Debug log
        tasks = db.query(models.Task).offset(skip).limit(limit).all()
        print(f"Found {len(tasks)} tasks")  # Debug log
        
        # Temporary: Print the first task to check serialization
        if tasks:
            print("Sample task:", tasks[0].__dict__)
        
        return tasks
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f'Error retrieving tasks statistics: {str(e)}'
        )

@router.get('/{task_id}', response_model=schemas.TaskResponse)
def read_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id_task == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail='Задание не найдено')
    return task

@router.post("/", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), _=Depends(require_teacher)):
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete('/{task_id}', status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id_task == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail='Задание не найдено')

    db.delete(task)
    db.commit()