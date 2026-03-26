import logging
from datetime import UTC, datetime, timedelta

from ..database.database import get_db
from ..database.entities import EssayProcessingQueue, EssayProcessingStatus
from ..services.helpers.files_services import remove_file

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

COMPLETED_RETENTION_HOURS = 24


def cleanup_completed_queue_entries():
    cutoff = datetime.now(UTC) - timedelta(hours=COMPLETED_RETENTION_HOURS)

    with get_db() as db:
        entries = (
            db.query(EssayProcessingQueue)
            .filter(
                EssayProcessingQueue.status == EssayProcessingStatus.COMPLETED,
                EssayProcessingQueue.updated_at < cutoff,
            )
            .all()
        )

        if not entries:
            return

        logging.info(
            f"Cleaning up {len(entries)} completed queue entries older than {COMPLETED_RETENTION_HOURS}h."
        )

        for entry in entries:
            if entry.document_path:
                remove_file(entry.document_path)
                logging.info(
                    f"Removed PDF for queue entry {entry.id}: {entry.document_path}"
                )
            db.delete(entry)

        db.commit()
        logging.info(
            f"Cleanup of completed queue entries finished. Removed {len(entries)} rows."
        )
