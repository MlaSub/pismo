import asyncio
import logging

from ..database.database import get_db
from ..database.entities import (
    Essay,
    EssayProcessingQueue,
    EssayProcessingStatus,
    FeedbackItem,
    FeedbackOrigin,
)
from ..database.helpers import bulk_entries_to_db, get_ids_by_status
from ..llm.llm_helper import chat_with_model, extract_json_from_response
from ..llm.prompts.essay_feedback_items_extractor import (
    get_essay_feedback_items_extraction_prompt,
)
from ..llm.schemas import FeedbackItemResponse

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

MAXIMUM_RETRIES = 2


def process_single_essay_for_feedback(entry_id: int):
    with get_db() as db:
        entry = (
            db.query(EssayProcessingQueue)
            .filter(
                EssayProcessingQueue.id == entry_id,
                EssayProcessingQueue.status
                == EssayProcessingStatus.READY_FOR_FEEDBACK_EXTRACTION,
                EssayProcessingQueue.retries < MAXIMUM_RETRIES,
            )
            .first()
        )
        if not entry:
            return

        entry.status = EssayProcessingStatus.FEEDBACK_EXTRACTION
        db.commit()

        essay = db.query(Essay).filter(Essay.id == entry.essay_id).first()
        if not essay or not essay.original_content or not essay.analyzed_content:
            logging.error(
                f"Essay with ID {entry.essay_id} not found or missing content for feedback extraction."
            )
            entry.status = EssayProcessingStatus.ERROR
            entry.retries += 1
            db.commit()
            return

        try:
            logging.info(
                f"Starting feedback extraction for essay with queue entry ID {entry_id}."
            )
            feedback_response = asyncio.run(
                chat_with_model(
                    get_essay_feedback_items_extraction_prompt(
                        essay.original_content, essay.analyzed_content
                    )
                )
            )
            feedback = FeedbackItemResponse.model_validate_json(
                extract_json_from_response(feedback_response)
            )
            bulk_entries_to_db(
                FeedbackItem,
                [
                    {
                        "user_id": entry.user_id,
                        "essay_id": entry.essay_id,
                        "feedback_origin": FeedbackOrigin.TEACHER,
                        "category": item.category,
                        "short_mistake_summary": item.short_mistake_summary,
                        "comments": item.comments,
                    }
                    for item in feedback.feedback_items
                ],
            )

        except Exception as e:
            logging.error(
                f"Error during feedback extraction for essay with queue entry ID {entry_id}: {e}"
            )
            entry.status = EssayProcessingStatus.ERROR
            entry.retries += 1
            db.commit()
            return

        entry.status = EssayProcessingStatus.COMPLETED
        db.commit()


def process_essays_for_feedback_extraction():
    # TODO: Handle the case to reprocess the situation when the feedback items were not extracted successfully.
    entries_to_process = get_ids_by_status(
        EssayProcessingQueue,
        "status",
        EssayProcessingStatus.READY_FOR_FEEDBACK_EXTRACTION,
    )

    logging.info(
        f"Found {len(entries_to_process)} essays ready for feedback extraction."
    )

    for entry_id in entries_to_process:
        process_single_essay_for_feedback(entry_id)
