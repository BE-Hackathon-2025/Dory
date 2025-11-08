import os
import functools
import asyncio
import logging

from google import genai
from pydantic import BaseModel, Field
from typing import List, Dict, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import our main data models
from src.models.request_models import Profile
from src.models.response_models import TranslateResponse, Question

# --- 1. Configure the Gemini Client ---
# This securely loads your key from the .env file
_api_key = os.environ.get("GOOGLE_API_KEY")

# Instantiate client; SDK will also read GEMINI_API_KEY automatically if not passed.
# Passing api_key explicitly is safe if you have it in env.
if _api_key:
    client = genai.Client(api_key=_api_key)
else:
    client = genai.Client()

# --- 2. Define AI-Specific Schemas ---
# These are the Pydantic models we will force the AI to return.
# This makes parsing 100% reliable.

class SummarySchema(BaseModel):
    """The JSON schema for a 'summary' request."""
    gist: List[str] = Field(
        description="A 3-5 bullet point list of the text's key ideas."
    )
    simplified_text: str = Field(
        description="The full original text, rewritten to be simple, clear, and easy to read."
    )

class VisualSchema(BaseModel):
    """The JSON schema for a 'visualize' request."""
    mermaid: str = Field(
        description="A single, valid Mermaid.js string (e.g., 'graph TD; A-->B;')."
    )

class SelfCheckSchema(BaseModel):
    """The JSON schema for a 'selfcheck' request."""
    questions: List[Question] = Field(
        description="A list of 3-5 specific, factual questions and their answers from the text."
    )

# --- 3. Define the "Mega-Prompts" ---

def get_summary_prompt(profile: Profile, text: str) -> str:
    """Generates the 'Persona' + 'Implicit Tone' prompt."""
    return f"""
    You are an expert tutor. A student with the profile {profile.learningNeed}
    at a {profile.gradeLevel} grade level needs help understanding a text.
    
    Task:
    1.  Generate a 3-5 bullet point 'gist' (summary).
    2.  Rewrite the full text ('simplified_text') to be simple, clear,
        and easy to read, with a neutral, implicit tone.
        
    Adhere strictly to the `SummarySchema` JSON format.

    Text to analyze:
    ---
    {text}
    ---
    """

def get_visualize_prompt(profile: Profile, text: str) -> str:
    """Generates the 'Strictly Constrained' visual prompt."""
    return f"""
    You are an expert learning designer. A student at a {profile.gradeLevel}
    level needs a visual for the following text.
    
    Task:
    1.  Analyze the text to find the core concept.
    2.  Choose *only* from `flowchart` or `mindmap` to represent it.
    3.  Generate a single, valid Mermaid.js diagram for that concept.
    
    Respond with *only* the `VisualSchema` JSON format.

    Text to analyze:
    ---
    {text}
    ---
    """

def get_selfcheck_prompt(profile: Profile, text: str) -> str:
    """Generates the 'Specific / Factual' question prompt."""
    return f"""
    You are an expert tutor.
    
    Task:
    1.  Read the following text.
    2.  Generate a list of 3-5 specific, factual questions that can
        be answered directly from the text.
    3.  Provide the short, correct answer for each question.
    
    Adhere strictly to the `SelfCheckSchema` JSON format.

    Text to analyze:
    ---
    {text}
    ---
    """


async def _generate_content_in_thread(
    model_name: str, prompt: str, config: Dict[str, Any]
):
    """
    Run the synchronous client.models.generate_content in a threadpool
    so the async FastAPI loop isn't blocked.
    """
    loop = asyncio.get_running_loop()
    func = functools.partial(
        client.models.generate_content,
        model=model_name,
        contents=prompt,
        config=config,
    )
    try:
        response = await loop.run_in_executor(None, func)
        return response
    except Exception as exc:
        logger.exception("Error while calling client.models.generate_content")
        raise

async def get_ai_summary(profile: Profile, text: str) -> TranslateResponse:
    print(f"AI: Generating 'summary' for {profile.learningNeed}...")
    
    prompt = get_summary_prompt(profile, text)
    
    # Use client.models.generate_content_async
    # and the 'config' parameter, per the documentation
    response = await _generate_content_in_thread(
        model_name="gemini-2.5-flash",
        prompt=prompt,
        config={ 
            "response_mime_type": "application/json", 
            "response_json_schema": SummarySchema.model_json_schema() 
        }
    )
    
    data = SummarySchema.model_validate_json(response.text) 
    
    return TranslateResponse(
        gist=data.gist,
        simplified_text=data.simplified_text
    )

async def get_ai_visual(profile: Profile, text: str) -> TranslateResponse:
    print(f"AI: Generating 'visual' for {profile.learningNeed}...")

    prompt = get_visualize_prompt(profile, text)
    
    response = await _generate_content_in_thread(
        model_name="gemini-2.5-flash",
        prompt=prompt,
        config={
            "response_mime_type": "application/json",
            "response_json_schema": VisualSchema.model_json_schema()
        }
    )

    data = VisualSchema.model_validate_json(response.text) 

    return TranslateResponse(mermaid=data.mermaid)

async def get_ai_selfcheck(profile: Profile, text: str) -> TranslateResponse:
    print(f"AI: Generating 'selfcheck' for {profile.learningNeed}...")

    prompt = get_selfcheck_prompt(profile, text)

    response = await _generate_content_in_thread(
        model_name="gemini-2.5-flash",
        prompt=prompt,
        config={
            "response_mime_type": "application/json",
            "response_json_schema": SelfCheckSchema.model_json_schema()
        }
    )

    data = SelfCheckSchema.model_validate_json(response.text) 
    
    return TranslateResponse(questions=data.questions)