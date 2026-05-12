"""
main.py - The entry point for our FastAPI AI microservice.

This is like the "index.js" or "app.js" in Express.
It creates the server, sets up middleware, and connects all our routes.

The AI service runs separately from the Next.js app on port 8000.
Next.js handles the main website (port 3000), this handles AI features.
"""
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import bio

app = FastAPI(
    title="PawPals AI Service",
    description="AI-powered features for pet bio generation, smart matching, and event recommendations",
    version="1.0.0",
)


def _parse_allowed_origins() -> list[str]:
    """
    Comma-separated list of browser origins allowed to call this API directly.

    Example:
      ALLOWED_ORIGINS=http://localhost:3000,https://pawpals-app.vercel.app

    Next.js API routes call this service from the server (no CORS), but any
    future client-side calls from the deployed site need the Vercel origin here.
    """
    raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    return [o.strip() for o in raw.split(",") if o.strip()]


def _allowed_origin_regex() -> str | None:
    """
    Optional single regex for extra origins (e.g. all Vercel preview deployments).

    Example:
      ALLOWED_ORIGIN_REGEX=https://.*\\.vercel\\.app

    Leave unset in production if you prefer an explicit allow-list only.
    """
    reg = os.getenv("ALLOWED_ORIGIN_REGEX", "").strip()
    return reg or None


# Allow the Next.js app (local + production / previews) to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=_parse_allowed_origins(),
    allow_origin_regex=_allowed_origin_regex(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bio.router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "pawpals-ai"}
