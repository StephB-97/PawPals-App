import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
 
/**
 * POST /api/events/[id]/rsvp
 *
 * Toggle RSVP for the authenticated user.
 * If the user has not RSVP'd, creates one and increments rsvpCount.
 * If the user already RSVP'd, removes it and decrements rsvpCount.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
 
    const { id: eventId } = await params;
 
    // Check event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
 
    // Check if already RSVP'd
    const existingRsvp = await prisma.eventRsvp.findUnique({
      where: {
        eventId_ownerId: { eventId, ownerId: owner.id },
      },
    });
 
    if (existingRsvp) {
      // Remove RSVP and decrement count
      await prisma.$transaction([
        prisma.eventRsvp.delete({
          where: { eventId_ownerId: { eventId, ownerId: owner.id } },
        }),
        prisma.event.update({
          where: { id: eventId },
          data: { rsvpCount: { decrement: 1 } },
        }),
      ]);
 
      return NextResponse.json({ rsvpStatus: "removed" });
    } else {
      // Create RSVP and increment count
      await prisma.$transaction([
        prisma.eventRsvp.create({
          data: { eventId, ownerId: owner.id },
        }),
        prisma.event.update({
          where: { id: eventId },
          data: { rsvpCount: { increment: 1 } },
        }),
      ]);
 
      return NextResponse.json({ rsvpStatus: "added" }, { status: 201 });
    }
  } catch (error) {
    console.error("POST /api/events/[id]/rsvp error:", error);
    return NextResponse.json(
      { error: "Failed to toggle RSVP" },
      { status: 500 }
    );
  }
}
 
/**
 * DELETE /api/events/[id]/rsvp
 *
 * Explicitly remove RSVP for the authenticated user.
 * Decrements rsvpCount on the event.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
 
    const { id: eventId } = await params;
 
    // Check if RSVP exists
    const existingRsvp = await prisma.eventRsvp.findUnique({
      where: {
        eventId_ownerId: { eventId, ownerId: owner.id },
      },
    });
 
    if (!existingRsvp) {
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
 
    return NextResponse.json({ rsvpStatus: "removed" });
  } catch (error) {
    console.error("DELETE /api/events/[id]/rsvp error:", error);
    return NextResponse.json(
      { error: "Failed to remove RSVP" },
      { status: 500 }
    );
  }
}