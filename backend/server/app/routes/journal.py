from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..auth import require_teacher
from .. import schemas, models
from ..database import get_db

router = APIRouter(prefix='/journal', tags=['journal'])

@router.post('/', response_model=schemas.JournalResponse)
def give_task(journal: schemas.JournalCreate, db: Session = Depends(get_db), _ = Depends(require_teacher)):
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

@router.delete("/{student_login}/{task_id}")
def delete_task(student_login: str, task_id: int, db: Session = Depends(get_db), _ = Depends(require_teacher)):
    try:
        journal_entry = db.query(models.Journal).filter(
            models.Journal.student_login == student_login,
            models.Journal.id_task == task_id
        ).first()

        if not journal_entry:
            raise HTTPException(status_code=404, detail="Task not found for this student")
        
        db.delete(journal_entry)
        db.commit()

        return {"message": "Task successfully deleted from student"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@router.post('/{student_login}/{task_id}/{rating}', response_model=schemas.JournalResponse)
def upsert_journal_entry(
    student_login: str,
    task_id: int,
    rating: int,
    db: Session = Depends(get_db)
):
    try:
        # Проверка существования студента
        student = db.query(models.Student).filter(models.Student.login == student_login).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        # Проверка существования задачи
        task = db.query(models.Task).filter(models.Task.id_task == task_id).first()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        # Поиск записи в журнале
        journal_entry = db.query(models.Journal).filter(
            models.Journal.student_login == student_login,
            models.Journal.id_task == task_id
        ).first()

        if journal_entry:
            # Обновление существующей записи
            journal_entry.mark = rating
        else:
            # Создание новой записи
            journal_entry = models.Journal(
                student_login=student_login,
                id_task=task_id,
                mark=rating
            )
            db.add(journal_entry)

        db.commit()
        db.refresh(journal_entry)
        return journal_entry

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to submit or update rating: {str(e)}"
        )