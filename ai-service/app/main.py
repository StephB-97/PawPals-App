"""
main.py - Entry point for the PawPals AI microservice.

Registers all routers. No external API keys required.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import embed, matching, tags

app = FastAPI(
    title="PawPals AI Service",
    description="AI-powered features for smart matching and event recommendations",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(embed.router)
app.include_router(matching.router)
app.include_router(tags.router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "pawpals-ai"}
