import asyncio
import json
import logging

from ..database.database import get_db
from ..database.entities import Essay, EssayProcessingQueue, EssayProcessingStatus
from ..database.helpers import get_ids_by_status, update_by_id
from ..llm.llm_helper import chat_with_model
from ..llm.prompts.essay_cerf_level_extractor import get_cerf_level_extraction_prompt
from ..llm.prompts.essay_extraction_instruction import get_prompt_for_essay_extraction

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


def process_essay(entry_id: int):
    with get_db() as db:
        entry = (
            db.query(EssayProcessingQueue)
            .filter(EssayProcessingQueue.id == entry_id)
            .first()
        )
        if not entry:
            return

        entry.status = EssayProcessingStatus.PROCESSING
        db.commit()

        extraction_response = asyncio.run(
            chat_with_model(get_prompt_for_essay_extraction(entry.raw_content))
        )
        extraction_data = json.loads(extraction_response)
        original_content = extraction_data["original_content"]
        analyzed_content = extraction_data["analyzed_content"]

        cerf_response = asyncio.run(
            chat_with_model(
                get_cerf_level_extraction_prompt(original_content, analyzed_content)
            )
        )
        cerf_data = json.loads(cerf_response)
        cerf_level_grade = cerf_data["cefr_level"]

        update_by_id(
            Essay,
            entry.essay_id,
            {
                "original_content": original_content,
                "analyzed_content": analyzed_content,
                "cerf_level_grade": cerf_level_grade,
            },
        )

        entry.status = EssayProcessingStatus.COMPLETED
        db.commit()


def process_pending_essays():
    pending_ids = get_ids_by_status(
        EssayProcessingQueue, "status", EssayProcessingStatus.PENDING
    )
    logging.info(f"Found {len(pending_ids)} pending essays to process.")
    for entry_id in pending_ids:
        logging.info(f"Processing essay with queue entry ID: {entry_id}")
        process_essay(entry_id)
