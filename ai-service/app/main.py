"""
main.py - The entry point for our FastAPI AI microservice.

This is like the "index.js" or "app.js" in Express.
It creates the server, sets up middleware, and connects all our routes.

The AI service runs separately from the Next.js app on port 8000.
Next.js handles the main website (port 3000), this handles AI features.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="PawPals AI Service",
    description="AI-powered features for pet bio generation, smart matching, and event recommendations",
    version="1.0.0",
)

# Allow the Next.js app to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


   
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "pawpals-ai"}
