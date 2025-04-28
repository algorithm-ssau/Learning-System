from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from .. import schemas, models
from ..database import get_db
from ..models import Student

router = APIRouter(prefix='/classes', tags=['classes'])

@router.get('/', response_model=list[dict])
async def get_class_statistics(db: Session = Depends(get_db)):
    try:
        class_stats = db.query(
            Student.class_name,
            func.count(Student.login).label('student_count')
        ).group_by(Student.class_name).all()

        return [{
            'class_name': class_name,
            'student_count': count
        } for class_name, count in class_stats]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f'Error retrieving class statistics: {str(e)}'
        )