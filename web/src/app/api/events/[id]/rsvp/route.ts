import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// POST — RSVP the current user to an event
export async function POST(_req: Request, { params }: Params) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    const owner = await prisma.owner.findUnique({ where: { clerkId: userId } });
    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const existing = await prisma.eventRsvp.findUnique({
      where: { eventId_ownerId: { eventId, ownerId: owner.id } },
    });
    if (existing) {
      return NextResponse.json({ error: "Already RSVP'd" }, { status: 409 });
    }

    await prisma.$transaction([
      prisma.eventRsvp.create({ data: { eventId, ownerId: owner.id } }),
      prisma.event.update({
        where: { id: eventId },
        data: { rsvpCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ rsvped: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events/[id]/rsvp error:", error);
    return NextResponse.json({ error: "Failed to RSVP" }, { status: 500 });
  }
}

// DELETE — remove the current user's RSVP from an event
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    const owner = await prisma.owner.findUnique({ where: { clerkId: userId } });
    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }

    const existing = await prisma.eventRsvp.findUnique({
      where: { eventId_ownerId: { eventId, ownerId: owner.id } },
    });
    if (!existing) {
      return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.eventRsvp.delete({
        where: { eventId_ownerId: { eventId, ownerId: owner.id } },
      }),
      prisma.event.update({
        where: { id: eventId },
        data: { rsvpCount: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({ rsvped: false });
  } catch (error) {
    console.error("DELETE /api/events/[id]/rsvp error:", error);
    return NextResponse.json({ error: "Failed to cancel RSVP" }, { status: 500 });
  }
}
