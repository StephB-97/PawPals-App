import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Delete existing seed data first
  await prisma.pet.deleteMany({
    where: {
      owner: {
        clerkId: {
          startsWith: 'seed',
        },
      },
    },
  })

  await prisma.owner.deleteMany({
    where: {
      clerkId: {
        startsWith: 'seed',
      },
    },
  })

  const owner1 = await prisma.owner.create({
    data: {
      clerkId: 'seed_user_1',
      email: 'sarah@example.com',
      displayName: 'Sarah Johnson',
      neighborhood: 'Upper West Side',
      city: 'New York',
      latitude: 40.7870,
      longitude: -73.9754,
    },
  })

  const owner2 = await prisma.owner.create({
    data: {
      clerkId: 'seed_user_2',
      email: 'mike@example.com',
      displayName: 'Mike Chen',
      neighborhood: 'Williamsburg',
      city: 'New York',
      latitude: 40.7081,
      longitude: -73.9571,
    },
  })

  const owner3 = await prisma.owner.create({
    data: {
      clerkId: 'seed_user_3',
      email: 'emma@example.com',
      displayName: 'Emma Rodriguez',
      neighborhood: 'Chelsea',
      city: 'New York',
      latitude: 40.7465,
      longitude: -74.0014,
    },
  })

  const owner4 = await prisma.owner.create({
    data: {
      clerkId: 'seed_user_4',
      email: 'daniel@example.com',
      displayName: 'Daniel Kim',
      neighborhood: 'SoHo',
      city: 'New York',
      latitude: 40.7233,
      longitude: -74.0030,
    },
  })

  const owner5 = await prisma.owner.create({
    data: {
      clerkId: 'seed_user_5',
      email: 'aisha@example.com',
      displayName: 'Aisha Khan',
      neighborhood: 'Astoria',
      city: 'New York',
      latitude: 40.7721,
      longitude: -73.9302,
    },
  })

  const owner6 = await prisma.owner.create({
    data: {
      clerkId: 'seed_user_6',
      email: 'james@example.com',
      displayName: 'James Wilson',
      neighborhood: 'Park Slope',
      city: 'New York',
      latitude: 40.6710,
      longitude: -73.9814,
    },
  })

  const owner7 = await prisma.owner.create({
    data: {
      clerkId: 'seed_user_7',
      email: 'maya@example.com',
      displayName: 'Maya Patel',
      neighborhood: 'Harlem',
      city: 'New York',
      latitude: 40.8116,
      longitude: -73.9465,
    },
  })

  const owner8 = await prisma.owner.create({
    data: {
      clerkId: 'seed_user_8',
      email: 'olivia@example.com',
      displayName: 'Olivia Brown',
      neighborhood: 'Brooklyn Heights',
      city: 'New York',
      latitude: 40.6960,
      longitude: -73.9937,
    },
  })

  const owner9 = await prisma.owner.create({
    data: {
      clerkId: 'seed_user_9',
      email: 'noah@example.com',
      displayName: 'Noah Martinez',
      neighborhood: 'East Village',
      city: 'New York',
      latitude: 40.7265,
      longitude: -73.9815,
    },
  })

  const owner10 = await prisma.owner.create({
    data: {
      clerkId: 'seed_user_10',
      email: 'lily@example.com',
      displayName: 'Lily Chen',
      neighborhood: 'Flushing',
      city: 'New York',
      latitude: 40.7675,
      longitude: -73.8330,
    },
  })

  const pets = [
    {
      ownerId: owner1.id,
      name: 'Buddy',
      species: 'dog',
      breed: 'Golden Retriever',
      size: 'large',
      ageMonths: 24,
      bio: 'Hi! I am Buddy and I love fetch more than anything in the world.',
      temperament: ['friendly', 'playful', 'energetic'],
    },
    {
      ownerId: owner1.id,
      name: 'Luna',
      species: 'cat',
      breed: 'Maine Coon',
      size: 'medium',
      ageMonths: 36,
      bio: 'I am Luna. I enjoy naps, window views, and ignoring people strategically.',
      temperament: ['calm', 'curious'],
    },
    {
      ownerId: owner2.id,
      name: 'Mochi',
      species: 'dog',
      breed: 'Corgi',
      size: 'small',
      ageMonths: 12,
      bio: 'My legs are short but my energy is infinite.',
      temperament: ['playful', 'energetic', 'friendly'],
    },
    {
      ownerId: owner2.id,
      name: 'Shadow',
      species: 'cat',
      breed: 'Siamese',
      size: 'small',
      ageMonths: 48,
      bio: 'I am mysterious and beautiful. I choose who I like carefully.',
      temperament: ['shy', 'calm', 'curious'],
    },
    {
      ownerId: owner3.id,
      name: 'Max',
      species: 'dog',
      breed: 'Labrador',
      size: 'large',
      ageMonths: 30,
      bio: 'I love walks, snacks, and making new friends.',
      temperament: ['friendly', 'energetic'],
    },
    {
      ownerId: owner3.id,
      name: 'Cleo',
      species: 'cat',
      breed: 'Persian',
      size: 'medium',
      ageMonths: 40,
      bio: 'I am calm, fluffy, and love cozy corners.',
      temperament: ['calm', 'gentle'],
    },
    {
      ownerId: owner4.id,
      name: 'Nova',
      species: 'dog',
      breed: 'Husky',
      size: 'large',
      ageMonths: 28,
      bio: 'I am loud, dramatic, and always ready for an adventure.',
      temperament: ['energetic', 'playful'],
    },
    {
      ownerId: owner4.id,
      name: 'Milo',
      species: 'cat',
      breed: 'British Shorthair',
      size: 'medium',
      ageMonths: 22,
      bio: 'I like quiet spaces and gentle friends.',
      temperament: ['calm', 'shy'],
    },
    {
      ownerId: owner5.id,
      name: 'Daisy',
      species: 'dog',
      breed: 'Poodle',
      size: 'medium',
      ageMonths: 18,
      bio: 'I am smart, sweet, and love attention.',
      temperament: ['friendly', 'curious'],
    },
    {
      ownerId: owner5.id,
      name: 'Nala',
      species: 'cat',
      breed: 'Ragdoll',
      size: 'medium',
      ageMonths: 34,
      bio: 'I love being held and treated like royalty.',
      temperament: ['gentle', 'calm'],
    },
    {
      ownerId: owner6.id,
      name: 'Charlie',
      species: 'dog',
      breed: 'Beagle',
      size: 'medium',
      ageMonths: 20,
      bio: 'I follow my nose everywhere and love meeting dogs.',
      temperament: ['curious', 'friendly'],
    },
    {
      ownerId: owner6.id,
      name: 'Simba',
      species: 'cat',
      breed: 'Bengal',
      size: 'medium',
      ageMonths: 26,
      bio: 'I am active, confident, and love to climb.',
      temperament: ['energetic', 'curious'],
    },
    {
      ownerId: owner7.id,
      name: 'Rocky',
      species: 'dog',
      breed: 'French Bulldog',
      size: 'small',
      ageMonths: 16,
      bio: 'I am small, silly, and full of personality.',
      temperament: ['playful', 'friendly'],
    },
    {
      ownerId: owner7.id,
      name: 'Willow',
      species: 'cat',
      breed: 'Scottish Fold',
      size: 'small',
      ageMonths: 21,
      bio: 'I am sweet, quiet, and love soft blankets.',
      temperament: ['calm', 'gentle'],
    },
    {
      ownerId: owner8.id,
      name: 'Penny',
      species: 'dog',
      breed: 'Dalmatian',
      size: 'large',
      ageMonths: 32,
      bio: 'I love running around and making everyone smile.',
      temperament: ['energetic', 'friendly'],
    },
    {
      ownerId: owner8.id,
      name: 'Pumpkin',
      species: 'cat',
      breed: 'Tabby',
      size: 'small',
      ageMonths: 14,
      bio: 'I am playful, curious, and always looking for snacks.',
      temperament: ['playful', 'curious'],
    },
    {
      ownerId: owner9.id,
      name: 'Teddy',
      species: 'dog',
      breed: 'Shih Tzu',
      size: 'small',
      ageMonths: 25,
      bio: 'I am fluffy, friendly, and love being spoiled.',
      temperament: ['friendly', 'calm'],
    },
    {
      ownerId: owner9.id,
      name: 'Ruby',
      species: 'cat',
      breed: 'Persian',
      size: 'medium',
      ageMonths: 38,
      bio: 'I am elegant and love peaceful company.',
      temperament: ['calm', 'shy'],
    },
    {
      ownerId: owner10.id,
      name: 'Cooper',
      species: 'dog',
      breed: 'Labrador',
      size: 'large',
      ageMonths: 27,
      bio: 'I am loyal, goofy, and always ready to play.',
      temperament: ['friendly', 'playful'],
    },
    {
      ownerId: owner10.id,
      name: 'Bella',
      species: 'cat',
      breed: 'Ragdoll',
      size: 'medium',
      ageMonths: 19,
      bio: 'I am soft, sweet, and love relaxing by the window.',
      temperament: ['gentle', 'calm'],
    },
  ]

  for (const pet of pets) {
    await prisma.pet.create({
      data: {
        ...pet,
        photoUrls: [],
        isActive: true,
      },
    })
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })