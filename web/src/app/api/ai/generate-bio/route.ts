import { NextResponse } from 'next/server';
import { parseApiErrorMessage } from '@/lib/parse-api-error';

type Body = {
  name?: string;
  species?: string;
  breed?: string;
  size?: string;
  ageMonths?: number;
  temperament?: string[];
};

export async function POST(request: Request) {
  const base = process.env.AI_SERVICE_URL;
  if (!base) {
    return NextResponse.json(
      {
        error:
          'Bio generation is not configured. Add AI_SERVICE_URL or write a short bio manually.',
      },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as Body;
    const response = await fetch(`${base.replace(/\/$/, '')}/ai/generate-bio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: body.name?.trim(),
        species: body.species?.trim(),
        breed: body.breed?.trim() || null,
        size: body.size?.trim() || null,
        age_months: Number.isFinite(body.ageMonths) ? body.ageMonths : 0,
        temperament: Array.isArray(body.temperament) ? body.temperament : [],
      }),
    });

    if (!response.ok) {
      const msg = await parseApiErrorMessage(
        response,
        'Could not reach the bio service. Please try again.'
      );
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const data = (await response.json()) as { bio?: string };
    if (!data.bio) {
      return NextResponse.json(
        { error: 'The bio service returned an empty response.' },
        { status: 502 }
      );
    }
    return NextResponse.json({ bio: data.bio });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
