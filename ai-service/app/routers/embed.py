"""
embed.py - API endpoint for pet embedding generation.

In this version, embeddings are not used (no paid API available).
The endpoint exists to satisfy the API contract and returns a
success response. The real matching uses trait-based scoring instead.
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["AI"])


class EmbedRequest(BaseModel):
    pet_id: str


class EmbedResponse(BaseModel):
    pet_id: str
    dimensions: int
    message: str


@router.post("/embed-pet", response_model=EmbedResponse)
async def embed_pet(request: EmbedRequest):
    """
    Embedding endpoint stub.

    Matching is handled by trait-based scoring in /ai/rank-matches
    so no vector embedding is generated. This endpoint exists to
    keep the API contract complete.
    """
    return EmbedResponse(
        pet_id=request.pet_id,
        dimensions=0,
        message="Matching uses trait-based scoring — no embedding needed.",
    )