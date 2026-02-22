from fastapi import APIRouter, Depends, HTTPException, UploadFile, status

from ..database.entities import EssayProcessingStatus, User
from ..dependencies import get_current_user
from ..schemas.inSchemas import EssayDetailRequest
from ..schemas.outSchemas import EssayDetailResponse, EssayResponse, EssayStatusResponse
from ..services.essay_services import (
    EssayAlreadyExistsError,
    get_essay_detail,
    get_essays_by_user,
    starting_essay_processing,
)
from ..services.helpers.files_services import save_pdf

router = APIRouter(prefix="/essay", tags=["essay"])

ALLOWED_MIME_TYPES = {"application/pdf"}


@router.get("/all", response_model=list[EssayResponse])
def get_essays(user: User = Depends(get_current_user)):
    return get_essays_by_user(user.id)


@router.get("/detail", response_model=EssayStatusResponse)
def get_essay(body: EssayDetailRequest, user: User = Depends(get_current_user)):
    detail = get_essay_detail(body.essay_id, user.id)
    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Essay not found",
        )

    processing_status = detail["processing_status"]

    if processing_status != EssayProcessingStatus.COMPLETED:
        return EssayStatusResponse(processing_status=processing_status)

    essay = detail["essay"]
    return EssayStatusResponse(
        processing_status=processing_status,
        detail=EssayDetailResponse(
            id=essay.id,
            title=essay.title,
            cerf_level_grade=essay.cerf_level_grade,
            original_content=essay.original_content,
            analyzed_content=essay.analyzed_content,
            created_at=essay.created_at,
            analysis=detail["analysis"],
            feedback_items=detail["feedback_items"],
        ),
    )


@router.post("/pdf")
async def create_essay_pdf(
    file: UploadFile,
    user: User = Depends(get_current_user),
):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Only PDF files allowed. Got: {file.content_type}",
        )

    file_path = save_pdf(file.file, user.uuid)
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
    user: User = Depends(get_current_user),
):
    pass
