import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { petAId, petBId, liked } = await request.json();
    if (!petAId || !petBId) 
      return NextResponse.json({ error: "petAId and petBId required" }, { status: 400 });

    const petA = await prisma.pet.findUnique({ where: { id: petAId }, include: { owner: true } });
    if (!petA || petA.owner.clerkId !== userId) 
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const [orderedPetAId, orderedPetBId] = [petAId, petBId].sort();

    let match = await prisma.match.findUnique({
      where: { petAId_petBId: { petAId: orderedPetAId, petBId: orderedPetBId } },
    });

    if (!match) {
      match = await prisma.match.create({
        data: {
          petAId: orderedPetAId,
          petBId: orderedPetBId,
          petALiked: orderedPetAId === petAId ? liked : false,
          petBLiked: orderedPetBId === petAId ? liked : false,
        },
      });
    } else {
      match = await prisma.match.update({
        where: { petAId_petBId: { petAId: orderedPetAId, petBId: orderedPetBId } },
        data: orderedPetAId === petAId ? { petALiked: liked } : { petBLiked: liked },
      });
    }

    const isMutual = match.petALiked && match.petBLiked;
    if (isMutual && !match.isMutual) {
      match = await prisma.match.update({
        where: { petAId_petBId: { petAId: orderedPetAId, petBId: orderedPetBId } },
        data: { isMutual: true },
      });
    }

    return NextResponse.json({ matchId: match.id, isMutual, petALiked: match.petALiked, petBLiked: match.petBLiked });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process swipe" }, { status: 500 });
  }
}