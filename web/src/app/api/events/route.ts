import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { eventDate: "asc" },
      include: {
        creator: {
          select: { displayName: true },
        },
        _count: {
          select: { rsvps: true },
        },
      },
    });

    const formatted = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.tags?.[0] || "Social",
      date: event.eventDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: event.eventDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      location: event.locationName || "TBD",
      attending: event._count.rsvps,
      creator: event.creator.displayName,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const body = await req.json();
    const { title, description, date, startTime, endTime, locationName, speciesAllowed, tags } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const eventDate = new Date(`${date}T${startTime || "12:00"}:00`);

    const event = await prisma.event.create({
      data: {
        creatorId: owner.id,
        title,
        description,
        locationName: locationName || null,
        eventDate,
        speciesAllowed: speciesAllowed ? [speciesAllowed] : [],
        tags: tags || [],
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}