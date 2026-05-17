"""
matcher.py - Trait-based pet matching scorer.

Ranks candidate pets by compatibility with a source pet
using shared temperament traits, species, and size.
No embeddings or external APIs needed.
"""

from sqlalchemy import text
from app.services.database import engine


def _compatibility_score(source: dict, candidate: dict) -> float:
    """
    Score 0.0–1.0 based on how compatible two pets are.

    Factors:
      - Shared temperament traits (biggest weight)
      - Same species (moderate weight)
      - Compatible size (small weight)
    """
    score = 0.0

    # Temperament overlap (up to 0.6)
    source_traits = set(t.lower() for t in (source.get("temperament") or []))
    cand_traits = set(t.lower() for t in (candidate.get("temperament") or []))

    if source_traits and cand_traits:
        overlap = len(source_traits & cand_traits)
        total = len(source_traits | cand_traits)
        score += 0.6 * (overlap / total) if total > 0 else 0.0
    else:
        score += 0.1  # small base score if no traits to compare

    # Same species bonus (0.25)
    if source.get("species", "").lower() == candidate.get("species", "").lower():
        score += 0.25

    # Size compatibility (0.15)
    size_order = {"small": 1, "medium": 2, "large": 3}
    s_size = size_order.get((source.get("size") or "medium").lower(), 2)
    c_size = size_order.get((candidate.get("size") or "medium").lower(), 2)
    size_diff = abs(s_size - c_size)
    if size_diff == 0:
        score += 0.15
    elif size_diff == 1:
        score += 0.08

    return score


def rank_candidates(pet_id: str, candidate_ids: list[str]) -> list[str]:
    """
    Fetch pet data from the database and return candidate_ids
    sorted by compatibility score (best match first).
    """
    if not candidate_ids:
        return []

    all_ids = [pet_id] + candidate_ids
    placeholders = ",".join(f":id{i}" for i in range(len(all_ids)))
    params = {f"id{i}": pid for i, pid in enumerate(all_ids)}

    with engine.connect() as conn:
        rows = conn.execute(
            text(
                f"SELECT id, species, size, temperament FROM pets "
                f"WHERE id IN ({placeholders})"
            ),
            params,
        ).fetchall()

    pet_data = {}
    for row in rows:
        pet_data[str(row[0])] = {
            "species": row[1],
            "size": row[2],
            "temperament": row[3] if row[3] else [],
        }

    source = pet_data.get(pet_id)
    if not source:
        return candidate_ids  # can't score, return original order

    scored = []
    for cid in candidate_ids:
        candidate = pet_data.get(cid)
        if candidate:
            s = _compatibility_score(source, candidate)
            scored.append((cid, s))
        else:
            scored.append((cid, 0.0))

    scored.sort(key=lambda x: x[1], reverse=True)
    return [cid for cid, _ in scored]