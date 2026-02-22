from apscheduler.schedulers.background import BackgroundScheduler

from .essay_analyser import process_essays_for_feedback_extraction
from .essay_builder import process_pending_essays

scheduler = BackgroundScheduler()

scheduler.add_job(
    process_pending_essays, "interval", minutes=1, id="process_pending_essays_job"
)

scheduler.add_job(
    process_essays_for_feedback_extraction,
    "interval",
    minutes=1,
    id="process_essays_for_feedback_extraction_job",
)
