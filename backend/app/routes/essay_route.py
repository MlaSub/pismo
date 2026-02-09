from fastapi import APIRouter, Depends, HTTPException, UploadFile, status

from ..dependencies import get_uuid_header
from ..services.essay_services import EssayAlreadyExistsError, starting_essay_processing
from ..services.helpers.files_services import save_pdf
from ..services.user_services import get_user_by_uuid

router = APIRouter(prefix="/essay", tags=["essay"])

ALLOWED_MIME_TYPES = {"application/pdf"}


@router.post("/pdf")
async def create_essay_pdf(
    file: UploadFile,
    uuid: str = Depends(get_uuid_header),
):
    user = get_user_by_uuid(uuid)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Only PDF files allowed. Got: {file.content_type}",
        )

    file_path = save_pdf(file.file, uuid)
    try:
        essay_processing_entry = starting_essay_processing(user.id, file_path)
    except EssayAlreadyExistsError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        ) from e

    return {"process_id": essay_processing_entry}


@router.post("/new")
def create_essay_text(
    uuid: str = Depends(get_uuid_header),
):
    user = get_user_by_uuid(uuid)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
