from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models
from ..database import get_db

router = APIRouter(prefix='/journal', tags=['journal'])

@router.post('/', response_model=schemas.JournalResponse)
def give_task(journal: schemas.JournalCreate, db: Session = Depends(get_db)):
    try:
        student = db.query(models.Student).filter(models.Student.login == journal.student_login).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        task = db.query(models.Task).filter(models.Task.id_task == journal.id_task).first()
        if not task:
            raise HTTPException(status_code=404, detail='Task not found')
        
        db_journal = models.Journal(**journal.dict())

        db.add(db_journal)
        db.commit()
        db.refresh(db_journal)

        return db_journal
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f'Error posting journal statisctic: {str(e)}'
        )
