import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

// GET
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const pet = await prisma.pet.findUnique({
    where:   { id, isActive: true },
    include: { owner: true },
  })
  if (!pet) {
    return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
  }
  return NextResponse.json(pet)
}

// PATCH
export async function PATCH(req: Request, { params }: Params) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const owner = await prisma.owner.findUnique({ where: { clerkId: userId } })
  const pet   = await prisma.pet.findUnique({ where: { id } })

  if (!owner || !pet || pet.ownerId !== owner.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { name, species, breed, size, ageMonths, bio, photoUrls, temperament } =
    await req.json()

  const updated = await prisma.pet.update({
    where: { id },
    data:  { name, species, breed, size, ageMonths, bio, photoUrls, temperament },
  })
  return NextResponse.json(updated)
}

// DELETE
export async function DELETE(_req: Request, { params }: Params) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const owner = await prisma.owner.findUnique({ where: { clerkId: userId } })
  const pet   = await prisma.pet.findUnique({ where: { id } })

  if (!owner || !pet || pet.ownerId !== owner.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const deleted = await prisma.pet.update({
    where: { id },
    data:  { isActive: false },
  })
  return NextResponse.json(deleted)
}