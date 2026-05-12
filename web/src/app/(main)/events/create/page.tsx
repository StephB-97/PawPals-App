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
    }
  }

  return (
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
