import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
 
/**
 * GET /api/discover/map
 *
 * Returns pets within the map's visible bounding box.
 * Coordinates are jittered (0.1–0.3 mile random offset) for privacy.
 *
 * Query params:
 *   swLat, swLng, neLat, neLng  — bounding box corners (required)
 *   species  — "dog", "cat", or "all" (default "all")
 *   size     — "small", "medium", "large", or "all" (default "all")
 */
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
 
    const { searchParams } = new URL(request.url);
 
    // Parse bounding box
    const swLat = parseFloat(searchParams.get("swLat") || "");
    const swLng = parseFloat(searchParams.get("swLng") || "");
    const neLat = parseFloat(searchParams.get("neLat") || "");
    const neLng = parseFloat(searchParams.get("neLng") || "");
 
    if ([swLat, swLng, neLat, neLng].some(isNaN)) {
      return NextResponse.json(
        { error: "swLat, swLng, neLat, neLng are required" },
        { status: 400 }
      );
    }
 
    // Filters
    const species = searchParams.get("species") || "all";
    const size = searchParams.get("size") || "all";
 
    // Get the current owner so we can exclude their own pets
    const owner = await prisma.owner.findUnique({
      where: { clerkId: userId },
    });
 
    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }
 
    // Build PostGIS query using ST_Within and a bounding box envelope
    // Jitter: random offset of 0.1–0.3 miles converted to approximate degrees
    // 1 mile ≈ 0.01449 degrees latitude, ≈ 0.01449 / cos(lat) degrees longitude
    // We use a simpler uniform offset in degrees: 0.1 mile ≈ 0.00145°, 0.3 mile ≈ 0.00435°
    let query = `
      SELECT
        p.id,
        p.name,
        p.species,
        p.breed,
        p.size,
        p.age_months   AS "ageMonths",
        p.bio,
        p.photo_urls   AS "photoUrls",
        p.temperament,
        -- Jittered coordinates: random offset between 0.00145° and 0.00435° (~0.1–0.3 miles)
        o.latitude  + (0.00145 + random() * 0.0029) * (CASE WHEN random() > 0.5 THEN 1 ELSE -1 END) AS latitude,
        o.longitude + (0.00145 + random() * 0.0029) * (CASE WHEN random() > 0.5 THEN 1 ELSE -1 END) AS longitude,
        o.display_name AS "ownerDisplayName"
      FROM pets p
      JOIN owners o ON p.owner_id = o.id
      WHERE o.id != $1::uuid
        AND p.is_active = true
        AND o.location IS NOT NULL
        AND ST_Within(
              o.location,
              ST_MakeEnvelope($2, $3, $4, $5, 4326)
            )
    `;
 
    const params: (string | number)[] = [owner.id, swLng, swLat, neLng, neLat];
 
    if (species !== "all") {
      query += ` AND p.species = $${params.length + 1}`;
      params.push(species);
    }
 
    if (size !== "all") {
      query += ` AND p.size = $${params.length + 1}`;
      params.push(size);
    }
 
    query += ` ORDER BY p.name ASC LIMIT 100`;
 
    const pets = await prisma.$queryRawUnsafe(query, ...params);
 
    return NextResponse.json(pets);
  } catch (error) {
    console.error("GET /api/discover/map error:", error);
    return NextResponse.json(
      { error: "Failed to fetch map pets" },
      { status: 500 }
    );
  }
}
 