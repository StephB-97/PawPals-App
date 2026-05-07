import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
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

    // Validate required fields
    if (!name || !species) {
      return NextResponse.json(
        { error: 'name and species are required' },
        { status: 400 }
      )
    }

    const pet = await prisma.pet.create({
      data: {
        ownerId: owner.id,
        name,
        species,
        breed,
        size,
        ageMonths,
        bio,
        photoUrls: photoUrls ?? [],
        temperament: temperament ?? [],
      },
    })

    return NextResponse.json(pet, { status: 201 })
  } catch (error) {
    console.error('POST /api/pets error:', error)
    return NextResponse.json({ error: 'Failed to create pet' }, { status: 500 })
  }
}