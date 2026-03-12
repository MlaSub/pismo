from ..database.database import get_db
from ..database.entities import User
from ..database.helpers import single_entry_to_db


class UserAlreadyExistsError(Exception):
    def __init__(self, uuid: str):
        self.uuid = uuid
        super().__init__(f"User with uuid {uuid} already exists")


def get_user_by_uuid(uuid: str) -> User | None:
    with get_db() as db:
        return db.query(User).filter(User.uuid == uuid).first()


def update_user(uuid: str, **kwargs: object) -> User | None:
    with get_db() as db:
        user = db.query(User).filter(User.uuid == uuid).first()
        if user is None:
            return None
        for key, value in kwargs.items():
            setattr(user, key, value)
        db.commit()
        db.refresh(user)
        return user


def create_user(uuid: str, **kwargs: object) -> User:
    existing = get_user_by_uuid(uuid)
    if existing:
        raise UserAlreadyExistsError(uuid)

    return single_entry_to_db(User, {"uuid": uuid, **kwargs})
