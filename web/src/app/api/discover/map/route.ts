import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const NYC_CENTER = { lat: 40.7128, lng: -74.006 };

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceMiles(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
) {
  const earthRadiusMiles = 3958.8;
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * earthRadiusMiles * Math.asin(Math.sqrt(a));
}

function getJitteredCoordinate(baseValue: number) {
  // Roughly within ~0.6 miles in either direction.
  return baseValue + (Math.random() - 0.5) * 0.018;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const speciesFilter = searchParams.get("species");
  const userLat = Number(searchParams.get("lat"));
  const userLng = Number(searchParams.get("lng"));
  const hasUserLocation = Number.isFinite(userLat) && Number.isFinite(userLng);

  const pets = await prisma.pet.findMany({
    where: {
      isActive: true,
      ...(speciesFilter && speciesFilter !== "all"
        ? { species: { equals: speciesFilter, mode: "insensitive" } }
        : {}),
    },
    include: {
      owner: {
        select: {
          latitude: true,
          longitude: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 200,
  });

  const payload = pets.map((pet) => {
    const baseLat = pet.owner.latitude ?? NYC_CENTER.lat;
    const baseLng = pet.owner.longitude ?? NYC_CENTER.lng;
    const latitude = getJitteredCoordinate(baseLat);
    const longitude = getJitteredCoordinate(baseLng);
    const originLat = hasUserLocation ? userLat : NYC_CENTER.lat;
    const originLng = hasUserLocation ? userLng : NYC_CENTER.lng;
    const distanceMiles = getDistanceMiles(originLat, originLng, latitude, longitude);

    return {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      photoUrl: pet.photoUrls[0] ?? null,
      latitude,
      longitude,
      distanceMiles: Number(distanceMiles.toFixed(1)),
    };
  });

  return NextResponse.json(payload);
}
