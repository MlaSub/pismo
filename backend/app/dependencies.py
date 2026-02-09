from fastapi import Header, HTTPException, status


def get_uuid_header(x_user_uuid: str = Header()) -> str:
    if not x_user_uuid.strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="X-User-UUID header is required",
        )
    return x_user_uuid
