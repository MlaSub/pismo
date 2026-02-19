from fastapi import FastAPI

from .database import entities
from .database.database import engine
from .jobs.job_scheduler import scheduler
from .routes.essay_route import router as essay_router
from .routes.user_route import router as user_router

app = FastAPI()

entities.Base.metadata.create_all(bind=engine)
scheduler.start()

app.include_router(user_router)
app.include_router(essay_router)
