from sqlalchemy.exc import SQLAlchemyError

from .database import Base, get_db


def single_entry_to_db[T: Base](model: type[T], data: dict) -> T:
    with get_db() as db:
        try:
            entry = model(**data)
            db.add(entry)
            db.commit()
            db.refresh(entry)
            return entry
        except SQLAlchemyError:
            db.rollback()
            raise


def get_ids_by_status[T: Base](
    model: type[T], status_field: str, status_value: str
) -> list[int]:
    with get_db() as db:
        entries = (
            db.query(model.id)
            .filter(getattr(model, status_field) == status_value)
            .all()
        )
        return [entry.id for entry in entries]


def update_by_id[T: Base](model: type[T], entry_id: int, data: dict) -> T | None:
    with get_db() as db:
        try:
            entry = db.query(model).filter(model.id == entry_id).first()
            if not entry:
                return None
            for key, value in data.items():
                setattr(entry, key, value)
            db.commit()
            db.refresh(entry)
            return entry
        except SQLAlchemyError:
            db.rollback()
            raise


def delete_by_id[T: Base](model: type[T], entry_id: int) -> T | None:
    with get_db() as db:
        try:
            entry = db.query(model).filter(model.id == entry_id).first()
            if not entry:
                return None
            db.delete(entry)
            db.commit()
            return entry
        except SQLAlchemyError:
            db.rollback()
            raise
