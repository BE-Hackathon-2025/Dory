from pydantic import BaseModel
from typing import List, Optional

class Question(BaseModel):
    """
    The structure for our "Self-Check" questions.
    """
    question: str
    answer: str

class TranslateResponse(BaseModel):
    """
    The response body for our Api endpoint.
    """
    gist: Optional[List[str]] = None
    simplified_text: Optional[str] = None
    mermaid: Optional[str] = None
    questions: Optional[List[Question]] = None