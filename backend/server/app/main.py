from datetime import datetime, timedelta
from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse, RedirectResponse
from typing import Optional
import secrets
from pydantic import BaseModel

from app import models
from .database import engine, Base
from .routes import students, tasks, classes, journal
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import get_db
from .auth import *
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@app.post("/login")
async def login(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)):

    data = await request.json()
    username = data.get("username")
    password = data.get("password")

    if username == os.getenv("TEACHER_LOGIN"):
        if password != os.getenv("TEACHER_PASSWORD"):
            raise HTTPException(status_code=400, detail="Invalid teacher credentials")
        role = "teacher"
        access_token = create_access_token(username, role)
        refresh_token = create_refresh_token(username, role)
    else:
        student = db.query(models.Student).filter(models.Student.login == username).first()
        if not student or password != student.password:
            raise HTTPException(status_code=400, detail="Invalid credentials")
        role = "student"
        access_token = create_access_token(username, role)
        refresh_token = create_refresh_token(username, role)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
        path="/",
    )
    return {"access_token": access_token, "role": role}

@app.post("/refresh")
async def refresh(request: Request):
    refresh_token = request.cookies.get('refresh_token')
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")
    
    payload = verify_token(refresh_token)
    if payload.get('type') != 'refresh':
        raise HTTPException(status_code=401, detail="Invalid token type")
    
    new_access_token = create_access_token(payload['sub'], payload['role'])
    return {'access_token': new_access_token}

@app.post('/logout')
async def logout(response: Response):
    response.delete_cookie('refresh_token')
    return {"message": "Logged out"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(classes.router)
app.include_router(students.router)
app.include_router(tasks.router)
app.include_router(journal.router)

@app.get('/')
def read_root():
    return {'message': 'Обучающая система API'}
