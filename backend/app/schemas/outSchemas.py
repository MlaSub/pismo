import datetime

from pydantic import BaseModel


class EssayResponse(BaseModel):
    id: int
    title: str
    cerf_level_grade: str | None
    original_content: str | None
    analyzed_content: str | None
    created_at: datetime.datetime

    model_config = {"from_attributes": True}


class FeedbackItemResponse(BaseModel):
    id: int
    feedback_origin: str
    category: str
    short_mistake_summary: str
    comments: str | None

    model_config = {"from_attributes": True}


class EssayAnalysisResponse(BaseModel):
    id: int
    analysis_result: str
    confidence: str
    recommendations: str | None

    model_config = {"from_attributes": True}


class EssayDetailResponse(EssayResponse):
    analysis: EssayAnalysisResponse | None
    feedback_items: list[FeedbackItemResponse]


class EssayStatusResponse(BaseModel):
    processing_status: str
    detail: EssayDetailResponse | None = None


class UserResponse(BaseModel):
    id: int
    username: str
    name: str | None
    uuid: str | None
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = {"from_attributes": True}
