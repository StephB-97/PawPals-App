"""
tag_suggester.py - Keyword-based event tag suggestion engine.

Scans event title and description for known keywords and returns
relevant tags. No external API needed.
"""

import re

# Keyword -> tag mappings. Order matters — first match wins per category.
_KEYWORD_TAGS: list[tuple[list[str], str]] = [
    # Species
    (["puppy", "puppies", "pup"], "puppy-friendly"),
    (["kitten", "kittens", "kitty"], "kitten-friendly"),
    (["dog", "dogs", "canine"], "dog-friendly"),
    (["cat", "cats", "feline"], "cat-friendly"),
    (["small dog", "small breed", "toy breed", "small dogs"], "small-dogs"),
    (["large dog", "large breed", "big dog", "large dogs"], "large-dogs"),

    # Location type
    (["park", "field", "outdoor", "outside", "garden", "yard"], "outdoor"),
    (["indoor", "inside", "studio", "gym", "center"], "indoor"),
    (["beach", "lake", "river", "water", "pool", "swim"], "water-friendly"),
    (["trail", "hike", "hiking", "mountain", "woods", "forest"], "hiking"),

    # Activity type
    (["off-leash", "off leash", "unleash", "free roam", "free run"], "off-leash"),
    (["leash", "on-leash", "on leash", "leashed"], "on-leash"),
    (["train", "training", "obedience", "class", "lesson"], "training"),
    (["agility", "obstacle", "course"], "agility"),
    (["play", "playdate", "play date", "playtime", "romp"], "playdate"),
    (["walk", "walking", "stroll"], "group-walk"),
    (["run", "running", "jog", "jogging"], "running"),
    (["fetch", "frisbee", "ball", "catch"], "fetch"),
    (["swim", "swimming", "splash"], "swimming"),

    # Social
    (["social", "socialize", "socialization", "meetup", "meet up", "gathering"], "social"),
    (["party", "celebration", "birthday", "bday"], "party"),
    (["adoption", "adopt", "rescue", "foster", "shelter"], "adoption"),
    (["charity", "fundrais", "donate", "volunteer"], "charity"),
    (["photo", "photograph", "picture", "photoshoot"], "photo-event"),

    # Vibe
    (["beginner", "new owner", "first time", "new pet"], "beginner-friendly"),
    (["senior", "older dog", "older cat", "elderly"], "senior-pets"),
    (["family", "kid", "children", "child"], "family-friendly"),
    (["free", "no cost", "complimentary"], "free-event"),
    (["weekend", "saturday", "sunday"], "weekend"),
    (["morning", "sunrise", "early"], "morning"),
    (["evening", "sunset", "night"], "evening"),
]


def suggest_tags(title: str, description: str) -> list[str]:
    """
    Analyze event title and description and return 3-6 relevant tags.
    """
    combined = f"{title} {description}".lower()
    # Normalize whitespace
    combined = re.sub(r"\s+", " ", combined)

    found_tags: list[str] = []
    seen: set[str] = set()

    for keywords, tag in _KEYWORD_TAGS:
        if tag in seen:
            continue
        for keyword in keywords:
            if keyword in combined:
                found_tags.append(tag)
                seen.add(tag)
                break

    # If we found very few, add some generic ones based on species mentions
    if len(found_tags) < 2:
        if any(w in combined for w in ["dog", "puppy", "pup", "canine"]):
            if "dog-friendly" not in seen:
                found_tags.append("dog-friendly")
        if any(w in combined for w in ["cat", "kitten", "kitty", "feline"]):
            if "cat-friendly" not in seen:
                found_tags.append("cat-friendly")
        if "social" not in seen:
            found_tags.append("social")

    return found_tags[:6]