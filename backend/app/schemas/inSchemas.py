from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    name: str | None = None


class UserLogin(BaseModel):
    username: str


class EssayDetailRequest(BaseModel):
    essay_id: int
