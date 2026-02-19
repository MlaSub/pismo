from enum import StrEnum

from pydantic import BaseModel


class CefrLevel(StrEnum):
    A1 = "A1"
    A2 = "A2"
    B1 = "B1"
    B2 = "B2"
    C1 = "C1"
    C2 = "C2"


class Confidence(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class EssayExtractionResponse(BaseModel):
    original_content: str
    analyzed_content: str


class CerfLevelResponse(BaseModel):
    cefr_level: CefrLevel
    confidence: Confidence
    reasoning: str
