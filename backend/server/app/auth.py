from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from .database import get_db

from . import models

SECRET_KEY = 'test-key'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        login: str = payload.get('sub')
        if login is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.Student).filter(models.Student.login == login).first()
    if user is None:
        user = {"login": login, "role": "teacher"}
    else:
        user = {"login": login, "role": "student"}
    return user

def require_teacher(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "teacher":
        raise HTTPException(status_code=403, detail="Teacher access required")
    return current_user

def verify_owner_or_teacher(login: str, current_user: dict = Depends(get_current_user)):
    if not (current_user.get("role") == "teacher" or current_user.get("login") == login):
        raise HTTPException(status_code=403, detail="Can't access other students' data")
    return current_user


def create_access_token(user_id: str, role: str):
    expires = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": user_id,
        "exp": expires,
        "role": role
    }
    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

def create_refresh_token(user_id: str, role: str):
    expires = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {'sub': user_id, 'exp': expires, 'type': 'refresh', 'role': role}
    
    refresh_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return refresh_token

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )