from apscheduler.schedulers.background import BackgroundScheduler

from .cleanup_job import cleanup_completed_queue_entries
from .essay_analyser import process_essays_for_feedback_extraction
from .essay_builder import process_pending_essays

scheduler = BackgroundScheduler()

scheduler.add_job(
    process_pending_essays, "interval", seconds=30, id="process_pending_essays_job"
)

scheduler.add_job(
    process_essays_for_feedback_extraction,
    "interval",
    seconds=30,
    id="process_essays_for_feedback_extraction_job",
)

scheduler.add_job(
    cleanup_completed_queue_entries,
    "interval",
    hours=12,
    id="cleanup_completed_queue_entries_job",
)
