from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    name: str | None = None


class EssayDetailRequest(BaseModel):
    essay_id: int
