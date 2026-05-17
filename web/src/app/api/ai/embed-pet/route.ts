import { NextResponse } from "next/server";

type EmbedPetRequest = {
  petId?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EmbedPetRequest;
    const petId = body.petId?.trim();

    if (!petId) {
      return NextResponse.json(
        { error: "petId is required." },
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

    const response = await fetch(`${aiServiceUrl}/ai/embed-pet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pet_id: petId }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to generate embedding." },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to generate embedding right now." },
      { status: 500 }
    );
  }
}