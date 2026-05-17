'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import { parseApiErrorMessage } from '@/lib/parse-api-error';

type PetFormData = {
  name: string;
  species: string;
  breed: string;
  size: string;
  age: number;
  temperament: string[];
  bio: string;
};

function PetForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PetFormData>({
    name: '',
    species: '',
    breed: '',
    size: '',
    age: 0,
    temperament: [],
    bio: '',
  });

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

  async function handleGenerateBio() {
    const name = formData.name.trim();
    const species = formData.species.trim();
    if (!name || !species) {
      setError('Add your pet’s name and species before generating a bio.');
      return;
    }
<<<<<<< HEAD:web/src/app/profile/create-pet/page.tsx
    setBioLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          species,
          breed: formData.breed.trim() || undefined,
          size: formData.size || undefined,
          ageMonths: formData.age,
          temperament: formData.temperament,
        }),
      });
      if (!response.ok) {
        const msg = await parseApiErrorMessage(response);
        throw new Error(msg);
      }
      const data = (await response.json()) as { bio?: string };
      if (!data.bio) {
        throw new Error('No bio was returned. Please try again.');
      }
      setFormData(prev => ({ ...prev, bio: data.bio ?? '' }));
      showToast('Bio added to the form. You can edit it before saving.', 'success');
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : 'Something went wrong. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setBioLoading(false);
    }
  }
=======
>>>>>>> origin/develop:web/src/app/(main)/profile/create-pet/page.tsx

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.species.trim()) {
      setError('Name and species are required.');
      return;
    }
    if (!formData.size.trim()) {
      setError('Please select a size (S, M, or L).');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          species: formData.species.trim(),
          breed: formData.breed.trim() || null,
          size: formData.size.trim(),
          ageMonths: formData.age,
          temperament: formData.temperament,
          bio: formData.bio.trim() || null,
          photoUrls: [],
        }),
      });

      if (!response.ok) {
        const msg = await parseApiErrorMessage(response);
        throw new Error(msg);
      }

      showToast('Pet saved successfully!', 'success');
      router.push('/dashboard');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="min-h-screen bg-[#FDF6EE] md:px-6 md:py-10">
        <div className="mx-auto w-full max-w-md bg-white min-h-screen md:min-h-0 md:max-w-4xl md:rounded-2xl md:shadow-sm">
          <div className="flex items-center border-b border-[#E8DDD0] gap-[0.9rem] pt-12 px-5 pb-3 md:px-6">
            <span className="text-[1rem] text-[#1A1A2E] cursor-pointer lg:hidden">&larr;</span>
            <span className="text-[1rem] text-[#1A1A2E] md:text-[1.1rem] font-bold">Add Pet</span>
          </div>

          {error ? (
            <div className="mx-5 mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</div>
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
                    placeholder="Pet's name"
                    className="w-full rounded-lg border-2 border-[#E5E7EB] px-3.5 py-3 text-[#1A1A2E] outline-none focus:border-[#E8734A]"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Species</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSpeciesToggle('dog')}
                      className={`rounded-lg p-2.5 text-[#1A1A2E] ${
                        formData.species === 'dog'
                          ? 'border-2 border-[#E8734A] bg-[#FFF1E8] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-[white]'
                      }`}
                    >
                      🐕 Dog
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSpeciesToggle('cat')}
                      className={`rounded-lg p-2.5 text-[#1A1A2E] ${
                        formData.species === 'cat'
                          ? 'border-2 border-[#E8734A] bg-[#FFF1E8] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-[white]'
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
                    placeholder="Pet's breed"
                    className="w-full rounded-lg border-2 border-[#E5E7EB] px-3.5 py-3 text-[#1A1A2E] outline-none focus:border-[#E8734A]"
                    onChange={handleChange}
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
                        className={`rounded-lg p-2.5 text-[#1A1A2E] ${
                          formData.size === sz
                            ? 'border-2 border-[#E8734A] bg-[#FFF1E8] text-[#E8734A]'
                            : 'border border-[#E8DDD0] bg-[white]'
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
                    value={formData.age}
                    type="number"
                    min={0}
                    className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-[#1A1A2E] outline-none focus:ring-2 focus:ring-[#E8734A]"
                    onChange={handleChange}
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
                        className={`cursor-pointer rounded-full px-3.5 py-2 text-[#1A1A2E] ${
                          formData.temperament.includes(trait)
                            ? 'border-2 border-[#E8734A] bg-[#FFF1E8] text-[#E8734A]'
                            : 'border border-[#E8DDD0] bg-[white]'
                        }`}
                      >
                        {trait.charAt(0).toUpperCase() + trait.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateBio}
                    disabled={bioLoading || loading}
                    className="w-full rounded-lg border-2 border-[#E8734A] bg-gradient-to-r from-[#FFD8C2] to-[#FFF1E8] px-3.5 py-3 font-semibold text-[#E8734A] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {bioLoading ? 'Generating…' : '✨ Generate Bio with AI'}
                  </button>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    placeholder="Tell everyone about your pet…"
                    className="h-[70px] w-full rounded-lg border-2 border-[#E5E7EB] px-4 py-3 text-[#1A1A2E] outline-none focus:border-[#E8734A]"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading || bioLoading}
                    className="flex-1 cursor-pointer rounded-lg border border-[#E8734A] bg-[linear-gradient(135deg,_#FF6B6B,_#FF8C42)] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'Saving…' : 'Save Pet'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default PetForm;
