import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const species = searchParams.get("species") || "all";
    const maxDistanceMiles = parseInt(searchParams.get("maxDistance") || "25");
    const maxDistanceMeters = maxDistanceMiles * 1609.34;

    const owner = await prisma.owner.findUnique({
      where: { clerkId: userId },
      include: { pets: true },
    });

    if (!owner?.pets.length)
      return NextResponse.json({ error: "No pets found" }, { status: 404 });
    if (!owner.latitude || !owner.longitude)
      return NextResponse.json({ error: "Location not set" }, { status: 400 });

    const swipedMatches = await prisma.match.findMany({
      where: {
        OR: [
          { petAId: { in: owner.pets.map((p) => p.id) } },
          { petBId: { in: owner.pets.map((p) => p.id) } },
        ],
      },
      select: { petAId: true, petBId: true },
    });

    const swipedPetIds = new Set<string>();
    swipedMatches.forEach((m) => {
      swipedPetIds.add(m.petAId);
      swipedPetIds.add(m.petBId);
    });

    let query = `
      SELECT p.id, p.name, p.species, p.breed, p.size, p.age_months as "ageMonths",
             p.bio, p.photo_urls as "photoUrls", p.temperament, o.latitude, o.longitude,
             ROUND(ST_Distance(o.location::geography, ST_SetSRID(ST_Point($1, $2), 4326)::geography) / 1609.34)::int as "distanceMiles"
      FROM pets p JOIN owners o ON p.owner_id = o.id
      WHERE o.id != $3::uuid AND p.is_active = true
        AND ST_DWithin(o.location::geography, ST_SetSRID(ST_Point($1, $2), 4326)::geography, $4)
    `;

    const params: unknown[] = [owner.longitude, owner.latitude, owner.id, maxDistanceMeters];

    if (species !== "all") {
      query += ` AND p.species = $${params.length + 1}`;
      params.push(species);
    }
    query += ` ORDER BY "distanceMiles" ASC LIMIT 50`;

    const pets = (await prisma.$queryRawUnsafe(query, ...params)) as {
      id: string;
      name: string;
      species: string;
      breed: string | null;
      size: string | null;
      ageMonths: number;
      bio: string | null;
      photoUrls: string[];
      temperament: string[];
      latitude: number;
      longitude: number;
      distanceMiles: number;
    }[];

    const availablePets = pets.filter((p) => !swipedPetIds.has(p.id));

    // Re-rank by trait-based compatibility via AI service
    const aiServiceUrl = process.env.AI_SERVICE_URL;
    if (aiServiceUrl && owner.pets.length > 0 && availablePets.length > 1) {
      try {
        const rankResponse = await fetch(`${aiServiceUrl}/ai/rank-matches`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pet_id: owner.pets[0].id,
            candidate_ids: availablePets.map((p) => p.id),
          }),
        });

        if (rankResponse.ok) {
          const { ranked_ids } = (await rankResponse.json()) as { ranked_ids: string[] };
          const petMap = new Map(availablePets.map((p) => [p.id, p]));
          const ranked = ranked_ids
            .map((id) => petMap.get(id))
            .filter((p): p is NonNullable<typeof p> => p !== undefined);
          const rankedSet = new Set(ranked_ids);
          const unranked = availablePets.filter((p) => !rankedSet.has(p.id));
          return NextResponse.json([...ranked, ...unranked]);
        }
      } catch (err) {
        console.error("AI ranking failed, falling back to distance order:", err);
      }
    }

    return NextResponse.json(availablePets);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 });
  }
}