from pydantic import BaseModel, Field
from typing import Literal, Optional

class Profile(BaseModel):
    """
    This is the user profile data the AI will use.
    """
    learningNeed: Optional[str]
    gradeLevel: Optional[str]
    ageGroup: Optional[str]

class TranslateRequest(BaseModel):
    """
    The request body for our Api endpoint.
    """
    text: str 
    profile: Profile
    mode: Literal["summary", "selfcheck", "visualize"]