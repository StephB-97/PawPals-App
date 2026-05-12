import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const owner = await prisma.owner.findUnique({
      where: { clerkId: userId },
    });
    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    const body = (await req.json()) as {
      title?: string;
      description?: string;
      eventDate?: string;
      locationName?: string;
      city?: string;
      tags?: string[] | string;
      speciesAllowed?: string[];
    };

    const title = body.title?.trim();
    const description = body.description?.trim();
    const eventDateRaw = body.eventDate;

    if (!title || !description || !eventDateRaw) {
      return NextResponse.json(
        { error: 'Title, description, and date & time are required.' },
        { status: 400 }
      );
    }

    const when = new Date(eventDateRaw);
    if (Number.isNaN(when.getTime())) {
      return NextResponse.json({ error: 'That date and time could not be read.' }, { status: 400 });
    }

    let tagList: string[] = [];
    if (Array.isArray(body.tags)) {
      tagList = body.tags.map(t => String(t).trim()).filter(Boolean);
    } else if (typeof body.tags === 'string') {
      tagList = body.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
    }

    const speciesAllowed =
      Array.isArray(body.speciesAllowed) && body.speciesAllowed.length > 0
        ? body.speciesAllowed.map(s => String(s).trim()).filter(Boolean)
        : ['dog', 'cat'];

    const event = await prisma.event.create({
      data: {
        creatorId: owner.id,
        title,
        description,
        eventDate: when,
        locationName: body.locationName?.trim() || null,
        city: body.city?.trim() || null,
        speciesAllowed,
        tags: tagList,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('POST /api/events error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
