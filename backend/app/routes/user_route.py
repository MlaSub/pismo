from fastapi import APIRouter, Depends, HTTPException, status

from ..dependencies import get_uuid_header
from ..schemas.inSchemas import UserCreate, UserLogin, UserUpdate
from ..schemas.outSchemas import UserResponse, UserResponseNoUuid
from ..services.user_services import (
    UserAlreadyExistsError,
    create_user,
    get_user_by_uuid,
    update_user,
)

router = APIRouter(prefix="/users", tags=["user"])


@router.post("/new", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user_route(
    body: UserCreate,
    uuid: str = Depends(get_uuid_header),
):
    try:
        user = create_user(uuid=uuid, **body.model_dump(exclude_none=True))
    except UserAlreadyExistsError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this UUID already exists",
        ) from e

    return user


@router.patch("/update", response_model=UserResponseNoUuid)
def update_user_route(
    body: UserUpdate,
    uuid: str = Depends(get_uuid_header),
):
    user = update_user(uuid=uuid, **body.model_dump(exclude_none=True))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.post("/login", response_model=UserResponse)
def login_user_route(body: UserLogin, uuid: str = Depends(get_uuid_header)):
    user = get_user_by_uuid(uuid)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    if user.username != body.username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username does not match",
        )
    return user
