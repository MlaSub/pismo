from fastapi import Depends, Header, HTTPException, status

from .database.entities import User
from .services.user_services import get_user_by_uuid


def get_uuid_header(x_user_uuid: str = Header()) -> str:
    if not x_user_uuid.strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="X-User-UUID header is required",
        )
    return x_user_uuid


def get_current_user(uuid: str = Depends(get_uuid_header)) -> User:
    user = get_user_by_uuid(uuid)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user
