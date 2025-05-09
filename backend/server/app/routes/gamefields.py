from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..auth import require_teacher

router = APIRouter(prefix="/gamefields", tags=["gamefields"])

@router.get("/gamefields/{game_field_id}", response_model=schemas.GameFieldResponse)
def get_game_field(game_field_id: int, db: Session = Depends(get_db)):
    game_field = db.query(models.GameField).filter(models.GameField.id_game_field == game_field_id).first()
    if not game_field:
        raise HTTPException(status_code=404, detail="Игровое поле не найдено")
    
    return game_field

@router.post("/", response_model=schemas.GameFieldResponse)
def create_game_field(field: schemas.GameFieldCreate, db: Session = Depends(get_db), _=Depends(require_teacher)):
    db_field = models.GameField(**field.dict())
    db.add(db_field)
    db.commit()
    db.refresh(db_field)
    return db_field


@router.put("/{field_id}", response_model=schemas.GameFieldResponse)
def update_game_field(field_id: int, field: schemas.GameFieldCreate, db: Session = Depends(get_db), _=Depends(require_teacher)):
    db_field = db.query(models.GameField).filter(models.GameField.id_game_field == field_id).first()
    if not db_field:
        raise HTTPException(status_code=404, detail="Игровое поле не найдено")
    for key, value in field.dict().items():
        setattr(db_field, key, value)
    db.commit()
    db.refresh(db_field)
    return db_field