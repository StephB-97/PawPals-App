import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

 
/**
 * GET /api/events
 *
 * List events with optional filters.
 * Query params:
 *   city     — filter by city name
 *   species  — filter by species allowed (e.g. "dog")
 *   date     — filter events on or after this ISO date string
 */
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
 
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const species = searchParams.get("species");
    const date = searchParams.get("date");
 
    // Build Prisma where clause
    const where: Record<string, unknown> = {};
 
    if (city) {
      where.city = { equals: city, mode: "insensitive" };
    }
 
    if (species) {
      where.speciesAllowed = { has: species };
    }
 
    if (date) {
      where.eventDate = { gte: new Date(date) };
    }
 
    const events = await prisma.event.findMany({
      where,
      orderBy: { eventDate: "asc" },
      include: {
        creator: {
          select: { id: true, displayName: true, avatarUrl: true },
        },
        rsvps: {
          select: { ownerId: true },
        },
      },
    });
 
    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
 
/**
 * POST /api/events
 *
 * Create a new event.
 * Body: { title, description, locationName?, city?, latitude?, longitude?,
 *         eventDate, speciesAllowed?, tags? }
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
 
    const owner = await prisma.owner.findUnique({
      where: { clerkId: userId },
    });
    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }
 
    const {
      title,
      description,
      locationName,
      city,
      latitude,
      longitude,
      eventDate,
      speciesAllowed,
      tags,
    } = await request.json();
 
    // Validate required fields
    if (!title || !description || !eventDate) {
      return NextResponse.json(
        { error: "title, description, and eventDate are required" },
        { status: 400 }
      );
    }
 
    const event = await prisma.event.create({
      data: {
        creatorId: owner.id,
        title,
        description,
        locationName: locationName ?? null,
        city: city ?? null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        eventDate: new Date(eventDate),
        speciesAllowed: speciesAllowed ?? [],
        tags: tags ?? [],
      },
      include: {
        creator: {
          select: { id: true, displayName: true, avatarUrl: true },
        },
      },
    });
 
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}