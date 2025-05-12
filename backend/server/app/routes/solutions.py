from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/solutions", tags=["solutions"])

@router.get("/{student_login}/{task_id}", response_model=schemas.SolutionResponse)
def get_solution(student_login: str, task_id: int, db: Session = Depends(get_db)):
    solution = db.query(models.Solution).filter(
        models.Solution.student_login == student_login,
        models.Solution.id_task == task_id
    ).first()
    if not solution:
        raise HTTPException(status_code=404, detail="Решение не найдено")
    return solution


@router.post("/{student_login}/{task_id}", response_model=schemas.SolutionResponse)
def submit_solution(
    student_login: str,
    task_id: int,
    submission: schemas.SolutionBase,
    db: Session = Depends(get_db)
):
    # Проверка соответствия пути и тела
    if submission.student_login != student_login or submission.id_task != task_id:
        raise HTTPException(status_code=400, detail="Данные пути и тела не совпадают")

    # Поиск существующего решения
    db_solution = db.query(models.Solution).filter_by(
        student_login=student_login,
        id_task=task_id
    ).first()

    if db_solution:
        db_solution.algorithm = submission.algorithm  # обновление
    else:
        db_solution = models.Solution(**submission.dict())  # создание
        db.add(db_solution)

    db.commit()
    db.refresh(db_solution)
    return db_solution

@router.delete("/{student_login}/{task_id}", status_code=204)
def delete_solution(
    student_login: str,
    task_id: int,
    db: Session = Depends(get_db)
):
    solution = db.query(models.Solution).filter_by(
        student_login=student_login,
        id_task=task_id
    ).first()

    if not solution:
        raise HTTPException(status_code=404, detail="Решение не найдено")

    db.delete(solution)
    db.commit()
    return None  # 204 No Content