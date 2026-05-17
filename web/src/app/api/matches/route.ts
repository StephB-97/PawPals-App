import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const owner = await prisma.owner.findUnique({
      where: { clerkId: userId },
      include: { pets: true },
    });

    if (!owner) return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    if (!owner.pets.length) return NextResponse.json([]);

    const userPetIds = owner.pets.map(p => p.id);
    const matches = await prisma.match.findMany({
      where: {
        isMutual: true,
        OR: [
          { petAId: { in: userPetIds } },
          { petBId: { in: userPetIds } },
        ],
      },
      include: { petA: { include: { owner: true } }, petB: { include: { owner: true } } },
    });

    const formatted = matches.map(m => {
      const isUserPetA = userPetIds.includes(m.petAId);
      const userPet = isUserPetA ? m.petA : m.petB;
      const matchedPet = isUserPetA ? m.petB : m.petA;
      const matchedOwner = isUserPetA ? m.petB.owner : m.petA.owner;

      return {
        matchId: m.id,
        createdAt: m.createdAt,
        userPet: { id: userPet.id, name: userPet.name, species: userPet.species, breed: userPet.breed },
        matchedPet: { id: matchedPet.id, name: matchedPet.name, species: matchedPet.species, breed: matchedPet.breed, size: matchedPet.size, ageMonths: matchedPet.ageMonths },
        matchedOwner: { id: matchedOwner.id, displayName: matchedOwner.displayName, city: matchedOwner.city },
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}