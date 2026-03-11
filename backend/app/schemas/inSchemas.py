from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    target_cefr_level: str | None


class UserLogin(BaseModel):
    username: str


class EssayDetailRequest(BaseModel):
    essay_id: int
