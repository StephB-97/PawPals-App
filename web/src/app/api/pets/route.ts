import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const owner = await prisma.owner.findUnique({
    where: { clerkId: userId },
  })
  if (!owner) {
    return NextResponse.json({ error: 'Owner not found' }, { status: 404 })
  }

  const { name, species, breed, size, ageMonths, bio, photoUrls, temperament } =
    await req.json()

  const pet = await prisma.pet.create({
    data: {
      ownerId:     owner.id,
      name,
      species,
      breed,
      size,
      ageMonths,
      bio,
      photoUrls:   photoUrls   ?? [],
      temperament: temperament ?? [],
    },
  })

  return NextResponse.json(pet, { status: 201 })
}