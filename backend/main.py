from dotenv import load_dotenv

# Load environment variables (from .env) before importing modules that
# read them at import time (e.g. src.ai.ai_services uses GOOGLE_API_KEY)
load_dotenv()

from src.ai.ai_services import get_ai_selfcheck, get_ai_summary, get_ai_visual
from src.models.request_models import TranslateRequest
from src.models.response_models import TranslateResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()

origins = [
    "http://localhost:3000",  
    "http://localhost",
    "https://dory-beige.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    """A simple health-check endpoint."""
    return {"status": "Dory AI Backend is running!"}


@app.post("/api/summarize", response_model=TranslateResponse)
async def translate_text(request: TranslateRequest):
    """
    This is our single, smart endpoint that routes to the
    correct AI prompt based on the 'mode' parameter.
    
    This function is a "router" that calls the
    correct function from ai/ai_services.py
    """
    
    # This is our "a-la-carte" logic
    if request.mode == "summary":
        return await get_ai_summary(request.profile, request.text)

    elif request.mode == "visualize":
        return await get_ai_visual(request.profile, request.text)

    elif request.mode == "selfcheck":
        return await get_ai_selfcheck(request.profile, request.text)