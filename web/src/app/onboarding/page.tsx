'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import { parseApiErrorMessage } from '@/lib/parse-api-error';

export default function OnboardingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ displayName?: string; neighborhood?: string }>({});
  const [formData, setFormData] = useState({
    displayName: '',
    neighborhood: '',
    city: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const displayName = formData.displayName.trim();
    const neighborhood = formData.neighborhood.trim();
    const nextFieldErrors: typeof fieldErrors = {};

    if (!displayName) {
      nextFieldErrors.displayName = 'Display name is required.';
    }
    if (!neighborhood) {
      nextFieldErrors.neighborhood = 'Neighborhood is required.';
    }
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/owners/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          neighborhood,
          city: formData.city.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const msg = await parseApiErrorMessage(response);
        throw new Error(msg);
      }

      showToast('Profile saved. Let’s add your first pet!', 'success');
      router.push('/profile/create-pet');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Welcome to PawPals! 🐾</h1>
          <p className="text-gray-600">Let&apos;s set up your profile first</p>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-800" role="alert">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold">Display Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="e.g., Sarah"
              className="w-full rounded border border-gray-300 p-2"
              autoComplete="name"
            />
            {fieldErrors.displayName ? (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.displayName}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Neighborhood</label>
            <input
              type="text"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              placeholder="e.g., Williamsburg"
              className="w-full rounded border border-gray-300 p-2"
            />
            {fieldErrors.neighborhood ? (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.neighborhood}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">City (optional)</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g., New York"
              className="w-full rounded border border-gray-300 p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Get Started'}
          </button>
        </form>
      </div>
    </div>
  );
}
