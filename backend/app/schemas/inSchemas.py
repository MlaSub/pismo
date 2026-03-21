from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    target_cefr_level: str | None
    push_token: str | None = None


class UserLogin(BaseModel):
    username: str


class UserUpdate(UserCreate):
    username: str | None = None
    target_cefr_level: str | None = None
    push_token: str | None = None


class EssayDetailRequest(BaseModel):
    essay_id: int
