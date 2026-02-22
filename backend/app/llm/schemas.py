from pydantic import BaseModel

from ..database.entities import AnalysisCategory, CefrLevel, Confidence


class EssayExtractionResponse(BaseModel):
    original_content: str
    analyzed_content: str


class CerfLevelResponse(BaseModel):
    cefr_level: CefrLevel
    confidence: Confidence
    reasoning: str
    recommendation: str


class FeedbackItem(BaseModel):
    category: AnalysisCategory
    short_mistake_summary: str
    comments: str | None


class FeedbackItemResponse(BaseModel):
    feedback_items: list[FeedbackItem]
