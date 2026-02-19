import asyncio
import logging

from ..database.database import get_db
from ..database.entities import Essay, EssayProcessingQueue, EssayProcessingStatus
from ..database.helpers import get_ids_by_status, update_by_id
from ..llm.llm_helper import chat_with_model
from ..llm.prompts.essay_cerf_level_extractor import get_cerf_level_extraction_prompt
from ..llm.prompts.essay_extraction_instruction import get_prompt_for_essay_extraction
from ..llm.schemas import CerfLevelResponse, EssayExtractionResponse

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


MAXIMUM_RETRIES = 3


def process_essay(entry_id: int):
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

        entry.status = EssayProcessingStatus.PROCESSING
        db.commit()

        try:
            extraction_response = asyncio.run(
                chat_with_model(get_prompt_for_essay_extraction(entry.raw_content))
            )
            extraction = EssayExtractionResponse.model_validate_json(
                extraction_response
            )

            cerf_response = asyncio.run(
                chat_with_model(
                    get_cerf_level_extraction_prompt(
                        extraction.original_content, extraction.analyzed_content
                    )
                )
            )
            cerf = CerfLevelResponse.model_validate_json(cerf_response)
        except Exception:
            logging.exception(f"Failed to process essay queue entry {entry_id}")
            entry.status = EssayProcessingStatus.ERROR
            entry.retries += 1
            db.commit()
            return

        update_by_id(
            Essay,
            entry.essay_id,
            {
                "original_content": extraction.original_content,
                "analyzed_content": extraction.analyzed_content,
                "cerf_level_grade": cerf.cefr_level,
            },
        )

        entry.status = EssayProcessingStatus.COMPLETED
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
