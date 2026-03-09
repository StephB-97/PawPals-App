"""
bio.py - API endpoint for generating pet bios.

Right now this uses a simple placeholder that builds a bio
from the pet's info using string formatting.

In Sprint 5, we'll replace the inside of generate_bio()
with a real call to OpenAI/Anthropic's API to generate
creative, personality-filled bios using AI.

The endpoint URL and request/response format won't change,
so the frontend code stays the same - we just swap the logic.
"""

from fastapi import APIRouter

from app.models.schemas import BioRequest, BioResponse

# All routes in this file will be under /ai
# So the function below becomes /ai/generate-bio
router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/generate-bio", response_model=BioResponse)
async def generate_bio(request: BioRequest):
    """
    Generate a pet bio from profile data.

    PLACEHOLDER VERSION - returns a simple formatted string.
    SPRINT 5 VERSION - will call an LLM API for a creative bio.
    """

    # Format the age nicely - "6 months" for puppies, "2 years" for adults
    age_label = f"{request.age_months} months" if request.age_months < 12 else f"{request.age_months // 12} years"

    # Join temperament tags into a readable string, default to "friendly"
    temperament_str = ", ".join(request.temperament) if request.temperament else "friendly"

    # Build a simple placeholder bio
    placeholder_bio = (
        f"Hi, I'm {request.name}! I'm a {age_label} old "
        f"{request.size or ''} {request.breed or request.species} "
        f"who loves being {temperament_str}. "
        f"Let's be friends!"
    )

    return BioResponse(bio=placeholder_bio.strip())