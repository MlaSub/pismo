import datetime
from enum import StrEnum

from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class FeedbackOrigin(StrEnum):
    TEACHER = "teacher"
    LLM = "llm"


class TimestampMixin:
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True, index=True)

    def __repr__(self) -> str:
        return f"<User(id={self.id}, username={self.username})>"


class Essay(TimestampMixin, Base):
    __tablename__ = "essays"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(index=True)
    raw_content: Mapped[str]
    original_content: Mapped[str | None]
    analyzed_content: Mapped[str | None]
    cerf_level_grade: Mapped[str | None]
    document_path: Mapped[str | None]

    def __repr__(self) -> str:
        return f"<Essay(id={self.id}, title={self.title})>"


class EssayAnalysis(TimestampMixin, Base):
    __tablename__ = "essay_analyses"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    essay_id: Mapped[int] = mapped_column(ForeignKey("essays.id", ondelete="CASCADE"))
    analysis_result: Mapped[str]
    recommendations: Mapped[str | None]

    def __repr__(self) -> str:
        return f"<EssayAnalysis(id={self.id}, essay_id={self.essay_id})>"


class Feedback(TimestampMixin, Base):
    __tablename__ = "feedback"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    essay_analysis_id: Mapped[int] = mapped_column(
        ForeignKey("essay_analyses.id", ondelete="CASCADE")
    )
    feedback_origin: Mapped[FeedbackOrigin]
    feedback_type: Mapped[str]
    comments: Mapped[str | None]

    def __repr__(self) -> str:
        return f"<Feedback(id={self.id}, essay_analysis_id={self.essay_analysis_id}, feedback_origin={self.feedback_origin})>"
