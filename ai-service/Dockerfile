# Dockerfile for the PawPals AI microservice
#
# This is a recipe that tells Docker how to build a container.
# Think of a container like a mini computer that only runs this service.
#
# We install dependencies BEFORE copying code so Docker can cache them.
# This means if you only change Python code, rebuilds are fast because
# Docker skips the pip install step.

# Start with a lightweight Python 3.11 image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy and install dependencies first (cached by Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Now copy all our code
COPY . .

# Start the FastAPI server on port 8000
# --reload makes it auto-restart when you save files (dev mode)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]