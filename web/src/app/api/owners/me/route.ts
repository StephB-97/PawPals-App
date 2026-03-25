import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const owner = await prisma.owner.findUnique({
    where:   { clerkId: userId },
    include: { pets: { where: { isActive: true } } },
  })

  if (!owner) {
    return NextResponse.json({ error: 'Owner not found' }, { status: 404 })
  }

  return NextResponse.json(owner)
}

export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { displayName, neighborhood, city, avatarUrl } = await req.json()

  const owner = await prisma.owner.update({
    where: { clerkId: userId },
    data:  { displayName, neighborhood, city, avatarUrl },
  })

  return NextResponse.json(owner)
}