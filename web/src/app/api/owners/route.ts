import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const owner = await prisma.owner.findUnique({
    where: { clerkId: userId },
    include: {
      pets: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!owner) {
    return NextResponse.json({ error: 'Owner not found' }, { status: 404 })
  }

  return NextResponse.json(owner, { status: 200 })
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { displayName, neighborhood, city, latitude, longitude, avatarUrl } = body

    // Build update object only with provided fields
    const updateData: any = {}
    if (displayName !== undefined) updateData.displayName = displayName
    if (neighborhood !== undefined) updateData.neighborhood = neighborhood
    if (city !== undefined) updateData.city = city
    if (latitude !== undefined) updateData.latitude = latitude
    if (longitude !== undefined) updateData.longitude = longitude
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl

    const owner = await prisma.owner.update({
      where: { clerkId: userId },
      data: updateData,
    })

    return NextResponse.json(owner, { status: 200 })
  } catch (error) {
    console.error('PATCH /api/owners/me error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}