from fastapi import APIRouter, Depends, HTTPException, status

from ..database.entities import User
from ..dependencies import get_current_user
from ..schemas.inSchemas import (
    WriteEssayDraftCreateRequest,
    WriteEssayDraftUpdateRequest,
)
from ..schemas.outSchemas import WriteEssayDraftResponse
from ..services.write_essay_services import (
    create_draft,
    delete_draft,
    get_draft_by_id,
    get_drafts_by_user,
    update_draft,
)

router = APIRouter(prefix="/write-essay", tags=["write-essay"])


@router.post(
    "/new", response_model=WriteEssayDraftResponse, status_code=status.HTTP_201_CREATED
)
def create_write_essay_draft(
    body: WriteEssayDraftCreateRequest, user: User = Depends(get_current_user)
):
    return create_draft(user.id, body.title, body.content)


@router.get("/all", response_model=list[WriteEssayDraftResponse])
def get_write_essay_drafts(user: User = Depends(get_current_user)):
    return get_drafts_by_user(user.id)


@router.get("/{draft_id}", response_model=WriteEssayDraftResponse)
def get_write_essay_draft(draft_id: int, user: User = Depends(get_current_user)):
    draft = get_draft_by_id(draft_id, user.id)
    if not draft:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Draft not found"
        )
    return draft


@router.patch("/{draft_id}", response_model=WriteEssayDraftResponse)
def update_write_essay_draft(
    draft_id: int,
    body: WriteEssayDraftUpdateRequest,
    user: User = Depends(get_current_user),
):
    draft = update_draft(draft_id, user.id, body.title, body.content)
    if not draft:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Draft not found"
        )
    return draft


@router.delete("/{draft_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_write_essay_draft(draft_id: int, user: User = Depends(get_current_user)):
    draft = delete_draft(draft_id, user.id)
    if not draft:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Draft not found"
        )
