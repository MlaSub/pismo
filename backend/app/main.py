from typing import Union

from fastapi import FastAPI

from .database.database import Base, engine
from .database import entities


app = FastAPI()

entities.Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"Hello": "World!!"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}