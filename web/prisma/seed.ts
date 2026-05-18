import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample owners
  const owner1 = await prisma.owner.upsert({
    where: { email: 'demo-sarah@pawpals.app' },
    update: {},
    create: {
      clerkId: 'demo_sarah_001',
      email: 'demo-sarah@pawpals.app',
      displayName: 'Sarah',
      neighborhood: 'Upper West Side',
      city: 'New York',
      latitude: 40.7831,
      longitude: -73.9712,
    },
  })

  const owner2 = await prisma.owner.upsert({
    where: { email: 'demo-mike@pawpals.app' },
    update: {},
    create: {
      clerkId: 'demo_mike_002',
      email: 'demo-mike@pawpals.app',
      displayName: 'Mike',
      neighborhood: 'Williamsburg',
      city: 'Brooklyn',
      latitude: 40.7081,
      longitude: -73.9571,
    },
  })

  const owner3 = await prisma.owner.upsert({
    where: { email: 'demo-emma@pawpals.app' },
    update: {},
    create: {
      clerkId: 'demo_emma_003',
      email: 'demo-emma@pawpals.app',
      displayName: 'Emma',
      neighborhood: 'Hoboken',
      city: 'Hoboken',
      latitude: 40.7440,
      longitude: -74.0324,
    },
  })

  const owner4 = await prisma.owner.upsert({
    where: { email: 'demo-alex@pawpals.app' },
    update: {},
    create: {
      clerkId: 'demo_alex_004',
      email: 'demo-alex@pawpals.app',
      displayName: 'Alex',
      neighborhood: 'Journal Square',
      city: 'Jersey City',
      latitude: 40.7326,
      longitude: -74.0633,
    },
  })

  const owner5 = await prisma.owner.upsert({
    where: { email: 'demo-lisa@pawpals.app' },
    update: {},
    create: {
      clerkId: 'demo_lisa_005',
      email: 'demo-lisa@pawpals.app',
      displayName: 'Lisa',
      neighborhood: 'Chelsea',
      city: 'New York',
      latitude: 40.7465,
      longitude: -74.0014,
    },
  })

  // Create sample pets
  await prisma.pet.createMany({
    skipDuplicates: true,
    data: [
      {
        ownerId: owner1.id,
        name: 'Buddy',
        species: 'dog',
        breed: 'Golden Retriever',
        size: 'L',
        ageMonths: 36,
        bio: 'Friendly golden who loves fetch and swimming! Always up for a park adventure.',
        photoUrls: [],
        temperament: ['friendly', 'playful', 'energetic'],
      },
      {
        ownerId: owner1.id,
        name: 'Whiskers',
        species: 'cat',
        breed: 'Siamese',
        size: 'M',
        ageMonths: 24,
        bio: 'Curious and talkative Siamese who loves meeting new friends.',
        photoUrls: [],
        temperament: ['curious', 'friendly'],
      },
      {
        ownerId: owner2.id,
        name: 'Luna',
        species: 'dog',
        breed: 'French Bulldog',
        size: 'S',
        ageMonths: 18,
        bio: 'Little Frenchie with a big personality! Loves snuggles and short walks.',
        photoUrls: [],
        temperament: ['playful', 'calm', 'friendly'],
      },
      {
        ownerId: owner2.id,
        name: 'Shadow',
        species: 'cat',
        breed: 'Maine Coon',
        size: 'L',
        ageMonths: 48,
        bio: 'Majestic Maine Coon who thinks he is a dog. Loves following people around.',
        photoUrls: [],
        temperament: ['calm', 'curious', 'friendly'],
      },
      {
        ownerId: owner3.id,
        name: 'Max',
        species: 'dog',
        breed: 'Labrador',
        size: 'L',
        ageMonths: 30,
        bio: 'Energetic lab who never says no to a swim or a game of fetch!',
        photoUrls: [],
        temperament: ['energetic', 'playful', 'friendly'],
      },
      {
        ownerId: owner3.id,
        name: 'Milo',
        species: 'cat',
        breed: 'British Shorthair',
        size: 'M',
        ageMonths: 12,
        bio: 'Chill and round. Loves watching birds from the window.',
        photoUrls: [],
        temperament: ['calm', 'shy'],
      },
      {
        ownerId: owner4.id,
        name: 'Bella',
        species: 'dog',
        breed: 'Beagle',
        size: 'M',
        ageMonths: 24,
        bio: 'Nose to the ground, always exploring! Loves treats and belly rubs.',
        photoUrls: [],
        temperament: ['curious', 'energetic', 'playful'],
      },
      {
        ownerId: owner4.id,
        name: 'Oliver',
        species: 'cat',
        breed: 'Persian',
        size: 'M',
        ageMonths: 36,
        bio: 'Fluffy and regal. Enjoys being admired from a respectful distance.',
        photoUrls: [],
        temperament: ['calm', 'shy'],
      },
      {
        ownerId: owner5.id,
        name: 'Charlie',
        species: 'dog',
        breed: 'Corgi',
        size: 'S',
        ageMonths: 15,
        bio: 'Short legs, big heart! This corgi is always smiling and ready to play.',
        photoUrls: [],
        temperament: ['playful', 'friendly', 'energetic'],
      },
      {
        ownerId: owner5.id,
        name: 'Nala',
        species: 'cat',
        breed: 'Bengal',
        size: 'M',
        ageMonths: 20,
        bio: 'Wild at heart! Loves climbing, hunting toys, and being the center of attention.',
        photoUrls: [],
        temperament: ['energetic', 'curious', 'playful'],
      },
    ],
  })

  // Create a sample event
  await prisma.event.create({
    data: {
      creatorId: owner1.id,
      title: 'Central Park Dog Walk',
      description: 'Join us for a group dog walk through Central Park! All friendly dogs welcome.',
      locationName: 'Central Park - Bethesda Fountain',
      city: 'New York',
      latitude: 40.7736,
      longitude: -73.9712,
      eventDate: new Date('2026-06-15T10:00:00Z'),
      speciesAllowed: ['dog'],
      tags: ['Social', 'Outdoor', 'Hiking'],
    },
  })

  await prisma.event.create({
    data: {
      creatorId: owner3.id,
      title: 'Pet Playdate at Liberty State Park',
      description: 'Bring your dogs and cats for a fun afternoon playdate with amazing views!',
      locationName: 'Liberty State Park',
      city: 'Jersey City',
      latitude: 40.7092,
      longitude: -74.0554,
      eventDate: new Date('2026-06-20T14:00:00Z'),
      speciesAllowed: ['dog', 'cat'],
      tags: ['Social', 'Outdoor', 'Fetch'],
    },
  })

  await prisma.event.create({
    data: {
      creatorId: owner5.id,
      title: 'Puppy Training Workshop',
      description: 'Free puppy training session for dogs under 1 year. Learn basic commands!',
      locationName: 'Chelsea Piers',
      city: 'New York',
      latitude: 40.7465,
      longitude: -74.0081,
      eventDate: new Date('2026-06-25T11:00:00Z'),
      speciesAllowed: ['dog'],
      tags: ['Training', 'Indoor'],
    },
  })

  console.log('Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })