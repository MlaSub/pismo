from collections.abc import Generator
from contextlib import contextmanager

from sqlalchemy import URL, create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from ..config import settings

database_url = URL.create(
    drivername="postgresql+psycopg",
    username=settings.postgres_user,
    password=settings.postgres_password,
    host=settings.database_host,
    port=settings.database_port,
    database=settings.postgres_db,
    query={"sslmode": "require"} if settings.enviroment != "development" else {},
)


engine = create_engine(database_url, connect_args={"prepare_threshold": None})

SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    pass


@contextmanager
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
