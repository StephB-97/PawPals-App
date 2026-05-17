"""
bio.py - API endpoint for generating pet bios.

Uses a smart template engine to produce creative, varied bios
without any external API calls.
"""

from fastapi import APIRouter

from app.models.schemas import BioRequest, BioResponse
from app.services.bio_generator import generate_bio

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/generate-bio", response_model=BioResponse)
async def generate_bio_endpoint(request: BioRequest):
    """Generate a creative pet bio from profile data."""

    bio = generate_bio(
        name=request.name,
        species=request.species,
        breed=request.breed,
        size=request.size,
        age_months=request.age_months,
        temperament=request.temperament,
    )

    return BioResponse(bio=bio)