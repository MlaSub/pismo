from fastapi import APIRouter, Depends, HTTPException, status

from ..dependencies import get_uuid_header
from ..schemas.inSchemas import UserCreate
from ..schemas.outSchemas import UserResponse
from ..services.user_services import UserAlreadyExistsError, create_user

router = APIRouter(prefix="/user", tags=["user"])


@router.post("/new", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user_route(
    body: UserCreate,
    uuid: str = Depends(get_uuid_header),
):
    try:
        user = create_user(username=body.username, uuid=uuid)
    except UserAlreadyExistsError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this UUID already exists",
        ) from e

    return user
