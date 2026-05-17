"""
matching.py - API endpoint for ranking pet matches by compatibility.

Uses trait-based scoring (shared temperament, species, size)
instead of vector embeddings. No external API calls needed.
"""

from fastapi import APIRouter

from app.models.schemas import RankRequest, RankResponse
from app.services.matcher import rank_candidates

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/rank-matches", response_model=RankResponse)
async def rank_matches(request: RankRequest):
    """Rank candidate pets by compatibility with the source pet."""

    ranked = rank_candidates(request.pet_id, request.candidate_ids)
    return RankResponse(ranked_ids=ranked)