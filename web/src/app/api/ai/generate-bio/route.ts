import { NextResponse } from "next/server";

type GenerateBioRequest = {
  name?: string;
  species?: string;
  breed?: string;
  size?: string;
  ageMonths?: number;
  temperament?: string[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateBioRequest;
    const name = body.name?.trim();
    const species = body.species?.trim();

    if (!name || !species) {
      return NextResponse.json(
        { error: "Name and species are required." },
        { status: 400 }
      );
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL;
    if (!aiServiceUrl) {
      return NextResponse.json(
        { error: "AI service is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(`${aiServiceUrl}/ai/generate-bio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        species,
        breed: body.breed?.trim() || null,
        size: body.size?.trim() || null,
        age_months: Number.isFinite(body.ageMonths) ? body.ageMonths : 0,
        temperament: Array.isArray(body.temperament) ? body.temperament : [],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to generate bio from AI service." },
        { status: 502 }
      );
    }

    const data = (await response.json()) as { bio?: string };
    if (!data.bio) {
      return NextResponse.json(
        { error: "AI response did not include bio text." },
        { status: 502 }
      );
    }

    return NextResponse.json({ bio: data.bio });
  } catch {
    return NextResponse.json(
      { error: "Unable to generate bio right now." },
      { status: 500 }
    );
  }
}
