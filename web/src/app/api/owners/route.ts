import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { displayName, email, neighborhood, city } = await req.json()

  const owner = await prisma.owner.upsert({
    where:  { clerkId: userId },
    update: {},
    create: {
      clerkId:     userId,
      email:       email       ?? '',
      displayName: displayName ?? '',
      neighborhood,
      city,
    },
  })

  return NextResponse.json(owner, { status: 201 })
}