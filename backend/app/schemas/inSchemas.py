from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    target_cefr_level: str | None


class UserLogin(BaseModel):
    username: str


class UserUpdate(UserCreate):
    username: str | None = None


class EssayDetailRequest(BaseModel):
    essay_id: int
