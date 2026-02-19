from ..database.database import get_db
from ..database.entities import Essay, EssayProcessingQueue, EssayProcessingStatus
from ..database.helpers import single_entry_to_db, update_by_id
from .helpers.files_services import extract_text_from_pdf
from .helpers.text_extractors import extract_email_subject


class EssayAlreadyExistsError(Exception):
    def __init__(self, essay_id: int, user_id: int):
        self.essay_id = essay_id
        self.user_id = user_id
        super().__init__(f"Essay with id {essay_id} already exists for this user")


def get_essay_by_title_and_user(essay_title: str, user_id: int) -> Essay | None:
    with get_db() as db:
        return (
            db.query(Essay)
            .filter(Essay.title == essay_title, Essay.user_id == user_id)
            .first()
        )


def create_or_update_essay(
    user_id: int,
    title: str,
    original_content: str | None = None,
    analyzed_content: str | None = None,
    cerf_level_grade: str | None = None,
    document_path: str | None = None,
    essay_id: int | None = None,
) -> Essay:
    if essay_id:
        essay = update_by_id(
            Essay,
            essay_id,
            {
                "title": title,
                "original_content": original_content,
                "analyzed_content": analyzed_content,
                "cerf_level_grade": cerf_level_grade,
                "document_path": document_path,
            },
        )
        if not essay:
            raise ValueError(f"Essay with id {essay_id} not found for user {user_id}")
        return essay

    existing_essay = get_essay_by_title_and_user(essay_title=title, user_id=user_id)
    if existing_essay:
        raise EssayAlreadyExistsError(essay_id=existing_essay.id, user_id=user_id)
    return single_entry_to_db(
        Essay,
        {
            "user_id": user_id,
            "title": title,
            "original_content": original_content,
            "analyzed_content": analyzed_content,
            "cerf_level_grade": cerf_level_grade,
            "document_path": document_path,
        },
    )


def register_essay_for_processing(
    essay_id: int | None, raw_content: str, document_path: str | None = None
):
    return single_entry_to_db(
        EssayProcessingQueue,
        {
            "essay_id": essay_id,
            "status": EssayProcessingStatus.PENDING,
            "raw_content": raw_content,
            "document_path": document_path,
        },
    )


def starting_essay_processing(user_id: int, file_path: str):
    file_content = extract_text_from_pdf(file_path)
    essay_title = extract_email_subject(file_content)
    essay = create_or_update_essay(
        user_id=user_id, title=essay_title, document_path=file_path
    )
    essay_process = register_essay_for_processing(
        essay_id=essay.id, raw_content=file_content, document_path=file_path
    )
    return essay_process.id
