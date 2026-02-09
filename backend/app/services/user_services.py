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


def create_user(username: str, uuid: str) -> User:
    existing = get_user_by_uuid(uuid)
    if existing:
        raise UserAlreadyExistsError(uuid)

    return single_entry_to_db(User, {"username": username, "uuid": uuid})
