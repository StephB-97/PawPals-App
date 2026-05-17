"""
tags.py - API endpoint for event tag suggestions.

Uses keyword extraction to suggest relevant tags.
No external API calls needed.
"""

from fastapi import APIRouter

from app.models.schemas import TagSuggestRequest, TagSuggestResponse
from app.services.tag_suggester import suggest_tags

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/suggest-tags", response_model=TagSuggestResponse)
async def suggest_tags_endpoint(request: TagSuggestRequest):
    """Suggest relevant tags for a community event."""

    tags = suggest_tags(request.title, request.description)
    return TagSuggestResponse(tags=tags)