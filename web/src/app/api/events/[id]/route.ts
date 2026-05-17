import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
 
/**
 * GET /api/events/[id]
 *
 * Get full details for a single event, including creator info and RSVP list.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
 
    const { id } = await params;
 
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, displayName: true, avatarUrl: true },
        },
        rsvps: {
          include: {
            owner: {
              select: { id: true, displayName: true, avatarUrl: true },
            },
          },
        },
      },
    });
 
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
 
    return NextResponse.json(event);
  } catch (error) {
    console.error("GET /api/events/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}