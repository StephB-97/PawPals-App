<<<<<<< HEAD
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import { parseApiErrorMessage } from '@/lib/parse-api-error';

export default function CreateEventPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    description?: string;
    eventDate?: string;
  }>({});

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [locationName, setLocationName] = useState('');
  const [city, setCity] = useState('');
  const [tagsRaw, setTagsRaw] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const next: typeof fieldErrors = {};
    if (!title.trim()) next.title = 'Title is required.';
    if (!description.trim()) next.description = 'Description is required.';
    if (!eventDate.trim()) next.eventDate = 'Date and time are required.';
    if (Object.keys(next).length > 0) {
      setFieldErrors(next);
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    try {
      const tags = tagsRaw
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          eventDate,
          locationName: locationName.trim() || undefined,
          city: city.trim() || undefined,
          tags,
        }),
      });
      if (!res.ok) {
        const msg = await parseApiErrorMessage(res);
        throw new Error(msg);
      }
      showToast('Event created!', 'success');
      router.push('/events');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
=======
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
>>>>>>> origin/develop
    }
  }

  return (
<<<<<<< HEAD
    <div className="mx-auto max-w-lg p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create event</h1>
        <Link href="/events" className="text-sm font-medium text-blue-600 hover:underline">
          Cancel
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800" role="alert">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setFieldErrors(f => ({ ...f, title: undefined }));
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Puppy playdate in the park"
          />
          {fieldErrors.title ? <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={e => {
              setDescription(e.target.value);
              setFieldErrors(f => ({ ...f, description: undefined }));
            }}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="What should people know?"
          />
          {fieldErrors.description ? (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Date &amp; time</label>
          <input
            type="datetime-local"
            value={eventDate}
            onChange={e => {
              setEventDate(e.target.value);
              setFieldErrors(f => ({ ...f, eventDate: undefined }));
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
          {fieldErrors.eventDate ? (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.eventDate}</p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Location (optional)</label>
          <input
            value={locationName}
            onChange={e => setLocationName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Central Park, Great Lawn"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">City (optional)</label>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="New York"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tags (optional)</label>
          <input
            value={tagsRaw}
            onChange={e => setTagsRaw(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="outdoor, off-leash, puppy-friendly"
          />
          <p className="mt-1 text-xs text-gray-500">Comma-separated tags</p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Publishing…' : 'Publish event'}
        </button>
      </form>
    </div>
  );
}
=======
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
>>>>>>> origin/develop
