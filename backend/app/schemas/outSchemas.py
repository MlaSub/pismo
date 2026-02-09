import datetime

from pydantic import BaseModel


class UserResponse(BaseModel):
    id: int
    username: str
    name: str | None
    uuid: str | None
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = {"from_attributes": True}
