import { NextResponse } from "next/server";

type SuggestTagsRequest = {
  title?: string;
  description?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SuggestTagsRequest;
    const title = body.title?.trim();
    const description = body.description?.trim();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required." },
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

    const response = await fetch(`${aiServiceUrl}/ai/suggest-tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to get tag suggestions from AI service." },
        { status: 502 }
      );
    }

    const data = (await response.json()) as { tags?: string[] };
    if (!Array.isArray(data.tags)) {
      return NextResponse.json(
        { error: "AI response did not include tags." },
        { status: 502 }
      );
    }

    return NextResponse.json({ tags: data.tags });
  } catch {
    return NextResponse.json(
      { error: "Unable to suggest tags right now." },
      { status: 500 }
    );
  }
}
