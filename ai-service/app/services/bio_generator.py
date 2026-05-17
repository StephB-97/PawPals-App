"""
bio_generator.py - Smart template-based pet bio generator.

Produces creative, varied bios without any external API call.
Uses randomized sentence templates combined with pet data
to create bios that feel AI-generated.
"""

import random

# Opening lines — written from the pet's perspective
_DOG_OPENERS = [
    "Woof! I'm {name}, a {age} {size}{breed} with a heart of gold.",
    "Hey there! {name} here — {age} {size}{breed} looking for my next adventure buddy.",
    "They call me {name}! I'm a {age} {size}{breed} who believes every day is the best day ever.",
    "Hi, I'm {name}! Just a {age} {size}{breed} trying to sniff out new friendships.",
    "*tail wagging intensifies* I'm {name}, a {age} {size}{breed} ready to steal your heart.",
    "Bork bork! {name} reporting for belly rubs. I'm a {age} {size}{breed}.",
]

_CAT_OPENERS = [
    "Meow. I'm {name}, a {age} {size}{breed}. Yes, I'm judging you — but lovingly.",
    "Hey, I'm {name} — a {age} {size}{breed} who will grace you with my presence.",
    "*slow blink* I'm {name}, a {age} {size}{breed}. I chose you. Feel honored.",
    "The name's {name}. {age} {size}{breed}. I enjoy naps, treats, and world domination.",
    "Hi! I'm {name}, a {age} {size}{breed}. I promise I'm friendlier than I look.",
    "Allow me to introduce myself: {name}, {age} {size}{breed}, professional lap warmer.",
]

# Personality descriptors based on temperament
_TEMPERAMENT_LINES = {
    "friendly": [
        "I've never met a stranger — only friends I haven't licked yet.",
        "I love everyone I meet and I'm not shy about showing it.",
        "Making new friends is basically my superpower.",
    ],
    "playful": [
        "Fetch, tug-of-war, zoomies — I'm always down to play!",
        "If it bounces, squeaks, or rolls, I'm there.",
        "My energy level? Let's just say I keep my humans on their toes.",
    ],
    "calm": [
        "I'm the chill one at the dog park — perfect for lazy Sunday vibes.",
        "Relaxation is an art form, and I've mastered it.",
        "I bring peaceful energy wherever I go.",
    ],
    "energetic": [
        "I've got enough energy for two pets (maybe three).",
        "Walks? I prefer sprints. Let's gooo!",
        "Adventure is my middle name. Actually it's not, but it should be.",
    ],
    "shy": [
        "I'm a little shy at first, but once I warm up? Best friend for life.",
        "It takes me a minute to open up, but the wait is worth it.",
        "I'm the quiet type — but my cuddles speak volumes.",
    ],
    "curious": [
        "Every corner has a new smell and I MUST investigate.",
        "I'm basically a detective with four legs and a wet nose.",
        "Exploring is what I do best — the world is full of surprises!",
    ],
    "loyal": [
        "Once you're my person, you're my person forever.",
        "Loyalty is my love language.",
        "I'll follow you anywhere — yes, even the bathroom.",
    ],
    "independent": [
        "I enjoy my me-time, but I'll always come back for snuggles.",
        "I do my own thing, but don't worry — I still love you.",
        "Self-sufficient with a side of affection. Best of both worlds.",
    ],
    "affectionate": [
        "Cuddles are my currency and I'm very generous.",
        "If you need a hug, I'm your pet. Seriously, try to stop me.",
        "I believe personal space is overrated.",
    ],
    "protective": [
        "I take my guard duty very seriously (but I'm also a softie).",
        "Your safety is my top priority — and also treats.",
        "Part best friend, part bodyguard. Full-time good boy.",
    ],
}

_GENERIC_PERSONALITY = [
    "I'm full of personality and ready to show it off!",
    "Life's too short not to wag your tail (or purr) every day.",
    "I've got a lot of love to give — come find out!",
]

# Closing lines
_CLOSERS = [
    "Let's be friends! 🐾",
    "Swipe right and let's hang! 🐾",
    "Can't wait to meet you and your human! 🐾",
    "Let's make some memories together! 🐾",
    "Your next best friend is right here! 🐾",
    "Come say hi — I promise I'm worth it! 🐾",
]


def generate_bio(
    name: str,
    species: str,
    breed: str | None,
    size: str | None,
    age_months: int,
    temperament: list[str],
) -> str:
    """Generate a creative 2-3 sentence bio from the pet's perspective."""

    # Format age
    if age_months < 12:
        age_str = f"{age_months}-month-old"
    elif age_months < 24:
        age_str = "1-year-old"
    else:
        age_str = f"{age_months // 12}-year-old"

    # Format size
    size_str = f"{size} " if size else ""

    # Format breed
    breed_str = breed if breed else species

    # Pick opener based on species
    openers = _DOG_OPENERS if species.lower() == "dog" else _CAT_OPENERS
    opener = random.choice(openers).format(
        name=name, age=age_str, size=size_str, breed=breed_str
    )

    # Pick a personality line based on temperament
    personality_line = None
    if temperament:
        for trait in temperament:
            trait_lower = trait.lower()
            if trait_lower in _TEMPERAMENT_LINES:
                personality_line = random.choice(_TEMPERAMENT_LINES[trait_lower])
                break

    if not personality_line:
        personality_line = random.choice(_GENERIC_PERSONALITY)

    # Pick a closer
    closer = random.choice(_CLOSERS)

    return f"{opener} {personality_line} {closer}"