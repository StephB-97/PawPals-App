'use client'

import { useEffect, useState } from 'react'

type Pet = {
  id: string
  name: string
  species?: string
  breed: string
  size?: string
  ageMonths: number
  bio: string
  photoUrls?: string[]
  temperament?: string[]
  distanceMiles?: number
}

export default function DiscoverPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchPets() {
      try {
        const response = await fetch('/api/discover/swipe')

        // TEMP FALLBACK DATA
        // since backend routes are not added yet
        if (!response.ok) {
          setPets([
            {
              id: 'demo-1',
              name: 'Buddy',
              species: 'dog',
              breed: 'Golden Retriever',
              ageMonths: 24,
              bio: 'I love fetch, walks, and making new friends!',
              temperament: ['friendly', 'playful', 'energetic'],
              distanceMiles: 1.2,
            },
            {
              id: 'demo-2',
              name: 'Luna',
              species: 'cat',
              breed: 'Maine Coon',
              ageMonths: 36,
              bio: 'I enjoy naps, window views, and calm company.',
              temperament: ['calm', 'curious'],
              distanceMiles: 2.4,
            },
            {
              id: 'demo-3',
              name: 'Mochi',
              species: 'dog',
              breed: 'Corgi',
              ageMonths: 12,
              bio: 'Short legs, huge energy, and always ready to play.',
              temperament: ['energetic', 'friendly'],
              distanceMiles: 0.8,
            },
          ])

          return
        }

        const data = await response.json()

        setPets(data.pets || data || [])
      } catch (err) {
        console.error(err)

        setError('Could not load pets right now.')
      } finally {
        setLoading(false)
      }
    }

    fetchPets()
  }, [])

  const currentPet = pets[currentIndex]

  function formatAge(ageMonths: number) {
    if (ageMonths < 12) {
      return `${ageMonths} months old`
    }

    const years = Math.floor(ageMonths / 12)

    return years === 1 ? '1 year old' : `${years} years old`
  }

  async function handleSwipe(action: 'like' | 'pass') {
    if (!currentPet) return

    try {
      await fetch('/api/matches/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petId: currentPet.id,
          action,
        }),
      })

      // TEMP fake match celebration
      if (action === 'like' && currentIndex === 1) {
        alert(`It's a match with ${currentPet.name}!`)
      }

      setCurrentIndex((prev) => prev + 1)
    } catch (err) {
      console.error(err)

      setCurrentIndex((prev) => prev + 1)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF8F1] px-4">
        <p className="text-[#8B7355]">Loading pets...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF8F1] px-4">
        <p className="text-[#8B7355]">{error}</p>
      </main>
    )
  }

  if (!currentPet) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#FFF8F1] px-6 text-center">
        <h1 className="mb-3 text-3xl font-bold text-[#3D2B1F]">
          Discover
        </h1>

        <p className="max-w-sm text-[#8B7355]">
          No more pets nearby. Try expanding your filters!
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FFF8F1] px-5 py-6">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-[#3D2B1F]">
          Discover
        </h1>

        <p className="mt-1 text-sm text-[#8B7355]">
          Find nearby pets for playdates
        </p>
      </header>

      <section className="mx-auto max-w-sm">
        <div className="mb-4 text-center">
          <p className="text-sm font-medium text-[#8B7355]">
            {currentIndex + 1} of {pets.length}
          </p>

          <div className="mt-2 flex justify-center gap-2">
            {pets.map((pet, index) => (
              <span
                key={pet.id}
                className={`h-2 w-2 rounded-full ${
                  index === currentIndex
                    ? 'bg-[#FF6B6B]'
                    : 'bg-[#E0D3C2]'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="relative h-[430px] bg-gradient-to-br from-[#F6C7B8] to-[#F7E1D2]">
            {currentPet.photoUrls &&
            currentPet.photoUrls.length > 0 ? (
              <img
                src={currentPet.photoUrls[0]}
                alt={currentPet.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-8xl">
                  {currentPet.species === 'cat'
                    ? '🐱'
                    : '🐶'}
                </span>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-white">
              <h2 className="text-3xl font-bold">
                {currentPet.name}
              </h2>

              <p className="mt-1 text-sm">
                {formatAge(currentPet.ageMonths)} •{' '}
                {currentPet.breed}
              </p>

              <p className="mt-1 text-sm">
                {currentPet.distanceMiles
                  ? `${currentPet.distanceMiles} miles away`
                  : 'Nearby'}
              </p>
            </div>
          </div>

          <div className="p-5">
            <p className="text-sm leading-6 text-[#5C4634]">
              {currentPet.bio}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {currentPet.temperament?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#FFE3D8] px-3 py-1 text-xs font-medium text-[#A8553A]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-center gap-8">
          <button
            onClick={() => handleSwipe('pass')}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl text-[#8B7355] shadow-md transition hover:scale-105"
          >
            ✕
          </button>

          <button
            onClick={() => handleSwipe('like')}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FF6B6B] text-3xl text-white shadow-md transition hover:scale-105"
          >
            ♥
          </button>
        </div>
      </section>
    </main>
  )
}