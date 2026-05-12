'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import ErrorState from '@/components/ui/ErrorState';
import { parseApiErrorMessage } from '@/lib/parse-api-error';

type PetFormData = {
  name: string;
  species: string;
  breed: string;
  size: string;
  age: number;
  temperament: string[];
  bio: string;
  photoUrls: string[];
};

type PetResponse = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  size: string | null;
  ageMonths: number;
  temperament: string[];
  bio: string | null;
  photoUrls: string[];
};

function normalizeSize(s: string | null | undefined): string {
  if (!s) return '';
  return s.toUpperCase();
}

export default function EditPetPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const petId = typeof params.id === 'string' ? params.id : params.id?.[0] ?? '';

  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'error' | 'ready'>('idle');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PetFormData>({
    name: '',
    species: '',
    breed: '',
    size: '',
    age: 0,
    temperament: [],
    bio: '',
    photoUrls: [],
  });

  const loadPet = useCallback(async () => {
    if (!petId) {
      setLoadError('Missing pet id.');
      setLoadState('error');
      return;
    }
    setLoadState('loading');
    setLoadError(null);
    try {
      const res = await fetch(`/api/pets/${petId}`);
      if (!res.ok) {
        const msg = await parseApiErrorMessage(res);
        throw new Error(msg);
      }
      const pet = (await res.json()) as PetResponse;
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed ?? '',
        size: normalizeSize(pet.size),
        age: pet.ageMonths,
        temperament: Array.isArray(pet.temperament) ? pet.temperament : [],
        bio: pet.bio ?? '',
        photoUrls: Array.isArray(pet.photoUrls) ? pet.photoUrls : [],
      });
      setLoadState('ready');
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setLoadState('error');
    }
  }, [petId]);

  useEffect(() => {
    void loadPet();
  }, [loadPet]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? Math.max(0, Number(value)) : value,
    }));
  }

  function handleSpeciesToggle(species: string) {
    setFormData(prev => ({ ...prev, species }));
  }

  function handleSizeToggle(size: string) {
    setFormData(prev => ({ ...prev, size }));
  }

  function handleTemperamentToggle(trait: string) {
    setFormData(prev => ({
      ...prev,
      temperament: prev.temperament.includes(trait)
        ? prev.temperament.filter(t => t !== trait)
        : [...prev.temperament, trait],
    }));
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim() || !formData.species.trim()) {
      setFormError('Name and species are required.');
      return;
    }
    if (!formData.size.trim()) {
      setFormError('Please select a size (S, M, or L).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/pets/${petId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          species: formData.species.trim(),
          breed: formData.breed.trim() || null,
          size: formData.size.trim(),
          ageMonths: formData.age,
          temperament: formData.temperament,
          bio: formData.bio.trim() || null,
          photoUrls: formData.photoUrls,
        }),
      });
      if (!res.ok) {
        const msg = await parseApiErrorMessage(res);
        throw new Error(msg);
      }
      showToast('Pet updated successfully!', 'success');
      router.push('/profile');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setFormError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadState === 'loading' || loadState === 'idle') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FDF6EE] p-6">
        <p className="text-gray-600">Loading pet…</p>
      </main>
    );
  }

  if (loadState === 'error' && loadError) {
    return (
      <main className="min-h-screen bg-[#FDF6EE] px-4 py-10">
        <div className="mx-auto max-w-md">
          <ErrorState message={loadError} onRetry={() => void loadPet()} />
          <Link href="/profile" className="mt-6 block text-center text-sm font-medium text-[#E8734A]">
            Back to profile
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDF6EE] md:px-6 md:py-10">
      <div className="mx-auto w-full max-w-md bg-white min-h-screen md:min-h-0 md:max-w-4xl md:rounded-2xl md:shadow-sm">
        <div className="flex items-center border-b border-[#E8DDD0] gap-[0.9rem] pt-12 px-5 pb-3 md:px-6">
          <Link href="/profile" className="text-[1rem] text-[#1A1A2E] lg:hidden">
            &larr;
          </Link>
          <span className="text-[1rem] font-bold text-[#1A1A2E] md:text-[1.1rem]">Edit Pet</span>
        </div>

        {formError ? (
          <div className="mx-5 mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">{formError}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="p-5 md:p-8">
          <div className="flex flex-col gap-6 md:grid md:grid-cols-[260px_1fr] md:gap-8">
            <div className="flex h-[130px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E8DDD0] bg-[#F9FAFB] md:h-[280px]">
              <span className="text-3xl md:text-4xl">📷</span>
              <span className="mt-2 text-sm text-gray-600">Upload Photo</span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-[#E5E7EB] px-3.5 py-3 text-[#1A1A2E] outline-none focus:border-[#E8734A]"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Species</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSpeciesToggle('dog')}
                    className={`rounded-lg p-2.5 ${
                      formData.species === 'dog'
                        ? 'border-2 border-[#E8734A] bg-[#FFF1E8] text-[#E8734A]'
                        : 'border border-[#E8DDD0] bg-white'
                    }`}
                  >
                    🐕 Dog
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSpeciesToggle('cat')}
                    className={`rounded-lg p-2.5 ${
                      formData.species === 'cat'
                        ? 'border-2 border-[#E8734A] bg-[#FFF1E8] text-[#E8734A]'
                        : 'border border-[#E8DDD0] bg-white'
                    }`}
                  >
                    🐱 Cat
                  </button>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Breed</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-[#E5E7EB] px-3.5 py-3 outline-none focus:border-[#E8734A]"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['S', 'M', 'L'] as const).map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleSizeToggle(sz)}
                      className={`rounded-lg p-2.5 ${
                        formData.size === sz
                          ? 'border-2 border-[#E8734A] bg-[#FFF1E8] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Age (Months)</label>
                <input
                  name="age"
                  type="number"
                  min={0}
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 outline-none focus:ring-2 focus:ring-[#E8734A]"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Temperament</label>
                <div className="flex flex-wrap gap-2">
                  {['friendly', 'playful', 'shy', 'energetic', 'calm', 'curious'].map(trait => (
                    <button
                      key={trait}
                      type="button"
                      onClick={() => handleTemperamentToggle(trait)}
                      className={`rounded-full px-3.5 py-2 ${
                        formData.temperament.includes(trait)
                          ? 'border-2 border-[#E8734A] bg-[#FFF1E8] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-white'
                      }`}
                    >
                      {trait.charAt(0).toUpperCase() + trait.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border-2 border-[#E5E7EB] px-4 py-3 outline-none focus:border-[#E8734A]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-gradient-to-br from-[#FF6B6B] to-[#FF8C42] py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? 'Saving…' : 'Save Changes'}
                </button>
                <Link
                  href="/profile"
                  className="hidden items-center justify-center rounded-lg border border-[#E8734A] px-5 py-3 font-semibold text-[#1A1A2E] lg:flex"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
