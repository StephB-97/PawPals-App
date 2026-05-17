'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const tagOptions = [
  'Social',
  'Training',
  'Fetch',
  'Hiking',
  'Swimming',
  'Outdoor',
  'Indoor',
]

export default function CreateEventPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [locationName, setLocationName] = useState('')
  const [speciesAllowed, setSpeciesAllowed] = useState('both')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  function toggleTag(tag: string) {
    setSelectedTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((item) => item !== tag)
        : [...currentTags, tag]
    )
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setLoading(true)

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          date,
          startTime,
          endTime,
          locationName,
          speciesAllowed,
          tags: selectedTags,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create event')
      }

      router.push('/events')
    } catch (error) {
      console.error(error)

      alert('Something went wrong while creating the event.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF8F1] px-5 py-6">
      <section className="mx-auto max-w-md">
        <button
          type="button"
          onClick={() => router.push('/events')}
          className="mb-4 text-sm font-medium text-[#8B7355]"
        >
          ← Back to Events
        </button>

        <h1 className="text-3xl font-bold text-[#3D2B1F]">
          Create Event
        </h1>

        <p className="mt-2 text-sm text-[#8B7355]">
          Plan a playdate, walk, or pet-friendly meetup.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 rounded-3xl bg-white p-5 shadow-lg"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#3D2B1F]">
              Event Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
              placeholder="Central Park Dog Walk"
              className="w-full rounded-2xl border border-[#E7D8C9] px-4 py-3 text-sm outline-none focus:border-[#FF6B6B]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#3D2B1F]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              required
              placeholder="Tell people what the event is about..."
              rows={4}
              className="w-full rounded-2xl border border-[#E7D8C9] px-4 py-3 text-sm outline-none focus:border-[#FF6B6B]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#3D2B1F]">
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
              required
              className="w-full rounded-2xl border border-[#E7D8C9] px-4 py-3 text-sm outline-none focus:border-[#FF6B6B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#3D2B1F]">
                Start Time
              </label>

              <input
                type="time"
                value={startTime}
                onChange={(event) =>
                  setStartTime(event.target.value)
                }
                required
                className="w-full rounded-2xl border border-[#E7D8C9] px-4 py-3 text-sm outline-none focus:border-[#FF6B6B]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#3D2B1F]">
                End Time
              </label>

              <input
                type="time"
                value={endTime}
                onChange={(event) =>
                  setEndTime(event.target.value)
                }
                required
                className="w-full rounded-2xl border border-[#E7D8C9] px-4 py-3 text-sm outline-none focus:border-[#FF6B6B]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#3D2B1F]">
              Location Name
            </label>

            <input
              type="text"
              value={locationName}
              onChange={(event) =>
                setLocationName(event.target.value)
              }
              required
              placeholder="Central Park"
              className="w-full rounded-2xl border border-[#E7D8C9] px-4 py-3 text-sm outline-none focus:border-[#FF6B6B]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#3D2B1F]">
              Species Allowed
            </label>

            <div className="grid grid-cols-3 gap-2">
              {['dogs', 'cats', 'both'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setSpeciesAllowed(option)
                  }
                  className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
                    speciesAllowed === option
                      ? 'bg-[#FF6B6B] text-white'
                      : 'bg-[#FFF1EA] text-[#8B7355]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-2xl bg-[#FFF1EA] px-4 py-3 text-sm font-semibold text-[#A8553A]"
          >
            ✨ Suggest Tags with AI
          </button>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#3D2B1F]">
              Tags
            </label>

            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-2 text-xs font-medium ${
                    selectedTags.includes(tag)
                      ? 'bg-[#FF6B6B] text-white'
                      : 'bg-[#FFE3D8] text-[#A8553A]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#FF6B6B] px-4 py-3 font-semibold text-white shadow-md disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </section>
    </main>
  )
}