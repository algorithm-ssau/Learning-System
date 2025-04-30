from fastapi import FastAPI
from .database import engine, Base
from .routes import students, tasks, classes, journal
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
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
