from apscheduler.schedulers.background import BackgroundScheduler

from .essay_builder import process_pending_essays

scheduler = BackgroundScheduler()

scheduler.add_job(
    process_pending_essays, "interval", minutes=1, id="process_pending_essays_job"
)
