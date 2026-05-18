import { auth, currentUser } from '@clerk/nextjs/server'
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

  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress ?? ''

  const { displayName, neighborhood, city, avatarUrl } = await req.json()

  // Geocode the neighborhood + city into coordinates
  let latitude = 40.7128
  let longitude = -74.006
  try {
    const query = encodeURIComponent(`${neighborhood || ''}, ${city || 'New York'}`)
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
      headers: { 'User-Agent': 'PawPals-App' },
    })
    const geoData = await geoRes.json()
    if (geoData.length > 0) {
      latitude = parseFloat(geoData[0].lat)
      longitude = parseFloat(geoData[0].lon)
    }
  } catch (err) {
    console.error('Geocoding failed, using default coordinates:', err)
  }

  const owner = await prisma.owner.upsert({
    where: { clerkId: userId },
    update: { displayName, neighborhood, city, avatarUrl, latitude, longitude },
    create: {
      clerkId: userId,
      email,
      displayName: displayName ?? '',
      neighborhood,
      city,
      avatarUrl,
      latitude,
      longitude,
    },
  })

  // Set the PostGIS geometry column
  await prisma.$executeRawUnsafe(
    `UPDATE owners SET location = ST_SetSRID(ST_Point($1, $2), 4326) WHERE clerk_id = $3`,
    longitude,
    latitude,
    userId
  )

  return NextResponse.json(owner)
}