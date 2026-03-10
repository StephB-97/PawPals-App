"""
schemas.py - Defines the shape of data for our API requests and responses.

These are like TypeScript interfaces but for Python.
FastAPI uses these to:
  1. Validate incoming requests (rejects bad data automatically)
  2. Generate API documentation at localhost:8000/docs
  3. Provide autocomplete in our code editor

  
Each endpoint has a Request model (what the client sends)
and a Response model (what we send back).
"""

from pydantic import BaseModel


# --- Bio Generation ---

class BioRequest(BaseModel):
    """What the client sends when asking us to generate a pet bio."""
    name: str                          # required - pet's name
    species: str                       # required - "dog" or "cat"
    breed: str | None = None           # optional - e.g. "Golden Retriever"
    size: str | None = None            # optional - "small", "medium", "large"
    age_months: int                    # required - age in months (e.g. 24 = 2 years)
    temperament: list[str] = []        # optional - e.g. ["friendly", "playful"]


class BioResponse(BaseModel):
    """What we send back - the generated bio text."""
    bio: str


# --- Smart Matching ---

class RankRequest(BaseModel):
    """What the client sends when asking us to rank pet matches by compatibility."""
    pet_id: str                        # the pet we're finding matches for
    candidate_ids: list[str]           # list of potential match pet IDs


class RankResponse(BaseModel):
    """What we send back - the same IDs but sorted by best match first."""
    ranked_ids: list[str]


# --- Event Tag Suggestions ---

class TagSuggestRequest(BaseModel):
    """What the client sends when asking for AI-suggested event tags."""
    title: str                         # event title, e.g. "Puppy Playdate in Central Park"
    description: str                   # event description


class TagSuggestResponse(BaseModel):
    """What we send back - suggested tags for the event."""
    tags: list[str]                    # e.g. ["puppy-friendly", "outdoor", "off-leash"]