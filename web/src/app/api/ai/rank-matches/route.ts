import { NextResponse } from "next/server";

type RankMatchesRequest = {
  petId?: string;
  candidateIds?: string[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RankMatchesRequest;
    const petId = body.petId?.trim();
    const candidateIds = body.candidateIds;

    if (!petId || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return NextResponse.json(
        { error: "petId and candidateIds are required." },
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

    const response = await fetch(`${aiServiceUrl}/ai/rank-matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pet_id: petId, candidate_ids: candidateIds }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to rank matches." },
        { status: 502 }
      );
    }

    const data = (await response.json()) as { ranked_ids: string[] };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to rank matches right now." },
      { status: 500 }
    );
  }
}