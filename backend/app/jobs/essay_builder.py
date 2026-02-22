import asyncio
import logging

from ..database.database import get_db
from ..database.entities import (
    Essay,
    EssayAnalysis,
    EssayProcessingQueue,
    EssayProcessingStatus,
    User,
)
from ..database.helpers import get_ids_by_status, single_entry_to_db, update_by_id
from ..llm.llm_helper import chat_with_model, extract_json_from_response
from ..llm.prompts.essay_cerf_level_extractor import get_cerf_level_extraction_prompt
from ..llm.prompts.essay_extraction_instruction import get_prompt_for_essay_extraction
from ..llm.schemas import CerfLevelResponse, EssayExtractionResponse

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


MAXIMUM_RETRIES = 2


def process_essay(entry_id: int) -> None:
    with get_db() as db:
        entry = (
            db.query(EssayProcessingQueue)
            .filter(
                EssayProcessingQueue.id == entry_id,
                EssayProcessingQueue.retries < MAXIMUM_RETRIES,
            )
            .first()
        )
        if not entry:
            return
        target_cefr_level = (
            db.query(User.target_cefr_level).filter(User.id == entry.user_id).scalar()
        )

        if not target_cefr_level:
            logging.error(
                f"User with ID {entry.user_id} not found or missing target CEFR level for essay processing."
            )
            return

        entry.status = EssayProcessingStatus.PROCESSING
        db.commit()

        try:
            extraction_response = asyncio.run(
                chat_with_model(get_prompt_for_essay_extraction(entry.raw_content))
            )
            extraction = EssayExtractionResponse.model_validate_json(
                extract_json_from_response(extraction_response)
            )

            cerf_response = asyncio.run(
                chat_with_model(
                    get_cerf_level_extraction_prompt(
                        target_cefr_level,
                        extraction.original_content,
                        extraction.analyzed_content,
                    )
                )
            )
            logging.info(
                f"Received CEFR extraction response for essay with queue entry ID {entry_id}"
            )
            cerf = CerfLevelResponse.model_validate_json(
                extract_json_from_response(cerf_response)
            )
            update_by_id(
                Essay,
                entry.essay_id,
                {
                    "original_content": extraction.original_content,
                    "analyzed_content": extraction.analyzed_content,
                    "cerf_level_grade": cerf.cefr_level,
                },
            )

            single_entry_to_db(
                EssayAnalysis,
                {
                    "user_id": entry.user_id,
                    "essay_id": entry.essay_id,
                    "analysis_result": cerf.reasoning,
                    "confidence": cerf.confidence,
                    "recommendations": cerf.recommendation,
                },
            )
        except Exception:
            # TODO: When an error occurs, not in all sitautions will it moved to ERROR status, because some errors can be catched and handled in the chat_with_model function.
            # We need to make sure that all errors that can occur during processing are properly catched and handled, and that only those that are related to the LLM response parsing are catched in the process_essay function, so that we can properly move the entry to ERROR status when the LLM response is not valid or cannot be parsed.
            logging.exception(f"Failed to process essay queue entry {entry_id}")
            with get_db() as error_db:
                error_entry = (
                    error_db.query(EssayProcessingQueue)
                    .filter(EssayProcessingQueue.id == entry_id)
                    .first()
                )
                if error_entry:
                    error_entry.status = EssayProcessingStatus.ERROR
                    error_entry.retries += 1
                    error_db.commit()
            return

        entry.status = EssayProcessingStatus.READY_FOR_FEEDBACK_EXTRACTION
        db.commit()


def process_pending_essays():
    pending_ids = get_ids_by_status(
        EssayProcessingQueue, "status", EssayProcessingStatus.PENDING
    )
    error_ids = get_ids_by_status(
        EssayProcessingQueue, "status", EssayProcessingStatus.ERROR
    )
    logging.info(
        f"Found {len(pending_ids)} pending essays to process. Found {len(error_ids)} essays to re-process due to previous errors."
    )
    for entry_id in pending_ids:
        logging.info(f"Processing essay with queue entry ID: {entry_id}")
        process_essay(entry_id)

    for entry_id in error_ids:
        logging.info(f"Re-processing essay with queue entry ID: {entry_id}")
        process_essay(entry_id)
