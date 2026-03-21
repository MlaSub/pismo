from ..database.database import get_db
from ..database.entities import WriteEssayDraft
from ..database.helpers import delete_by_id, single_entry_to_db, update_by_id


def get_drafts_by_user(user_id: int) -> list[WriteEssayDraft]:
    with get_db() as db:
        return (
            db.query(WriteEssayDraft).filter(WriteEssayDraft.user_id == user_id).all()
        )


def get_draft_by_id(draft_id: int, user_id: int) -> WriteEssayDraft | None:
    with get_db() as db:
        return (
            db.query(WriteEssayDraft)
            .filter(WriteEssayDraft.id == draft_id, WriteEssayDraft.user_id == user_id)
            .first()
        )


def create_draft(
    user_id: int, title: str | None, content: str | None
) -> WriteEssayDraft:
    return single_entry_to_db(
        WriteEssayDraft,
        {"user_id": user_id, "title": title, "content": content},
    )


def update_draft(
    draft_id: int, user_id: int, title: str | None, content: str | None
) -> WriteEssayDraft | None:
    draft = get_draft_by_id(draft_id, user_id)
    if not draft:
        return None
    return update_by_id(
        WriteEssayDraft,
        draft_id,
        {"title": title, "content": content},
    )


def delete_draft(draft_id: int, user_id: int) -> WriteEssayDraft | None:
    draft = get_draft_by_id(draft_id, user_id)
    if not draft:
        return None
    return delete_by_id(WriteEssayDraft, draft_id)
