"""
database.py - SQLAlchemy engine for raw SQL queries.

The AI service only reads pet data for matching — Prisma
owns the schema on the Next.js side.
"""

import os
from sqlalchemy import create_engine

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://pawpals:localdev@db:5432/pawpals")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)