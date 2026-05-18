'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ui/ImageUpload';

type PetFormData = {
  name: string;
  species: string;
  breed: string;
  size: string;
  age: number;
  temperament: string[];
  bio: string;
  photoUrl: string;
};

function PetForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PetFormData>({
    name: '',
    species: '',
    breed: '',
    size: '',
    age: 0,
    temperament: [],
    bio: '',
    photoUrl: '',
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

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (!formData.name || !formData.species) {
      setError('Name and species are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          species: formData.species,
          breed: formData.breed || null,
          size: formData.size || null,
          ageMonths: formData.age,
          temperament: formData.temperament,
          bio: formData.bio || null,
          photoUrls: formData.photoUrl ? [formData.photoUrl] : [],
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create pet');
      }

      router.push('/discover');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
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

          {error && (
            <div className="mx-5 mt-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-5 md:p-8">
            <div className="flex flex-col gap-6 md:grid md:grid-cols-[260px_1fr] md:gap-8">
              <ImageUpload onUploaded={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))} />

              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Pet's name"
                    className="w-full py-3 px-3.5 border-2 border-[#E5E7EB] rounded-lg outline-none text-[#1A1A2E] focus:border-[#E8734A]"
                    onChange={handleChange}
                    required
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
                          ? 'bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-white'
                      }`}
                    >
                      🐕 Dog
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSpeciesToggle('cat')}
                      className={`rounded-lg p-2.5 text-[#1A1A2E] ${
                        formData.species === 'cat'
                          ? 'bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]'
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
                    placeholder="Pet's breed"
                    className="w-full py-3 px-3.5 border-2 border-[#E5E7EB] rounded-lg outline-none text-[#1A1A2E] focus:border-[#E8734A]"
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['S', 'M', 'L'].map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`rounded-lg p-2.5 text-[#1A1A2E] ${
                          formData.size === size
                            ? 'bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]'
                            : 'border border-[#E8DDD0] bg-white'
                        }`}
                      >
                        {size}
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
                    className="w-full border border-[#E5E7EB] rounded-lg focus:ring-2 outline-none focus:ring-[#E8734A] text-[#1A1A2E] py-2 px-3"
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
                        className={`py-2 px-3.5 text-[#1A1A2E] rounded-full cursor-pointer ${
                          formData.temperament.includes(trait)
                            ? 'bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]'
                            : 'border border-[#E8DDD0] bg-white'
                        }`}
                      >
                        {trait.charAt(0).toUpperCase() + trait.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    placeholder="Write a short bio for your pet..."
                    className="w-full h-[70px] py-3 px-4 text-[#1A1A2E] border-2 border-[#E5E7EB] rounded-lg focus:border-[#E8734A] outline-none"
                    onChange={handleChange}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-4 border border-[#E8734A] bg-[linear-gradient(135deg,_#FF6B6B,_#FF8C42)] text-white rounded-lg cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Pet'}
                  </button>
                  <button
                    type="button"
                    className="hidden py-3 px-5 border border-[#E8734A] bg-white text-[#1A1A2E] rounded-lg cursor-pointer font-semibold lg:block"
                  >
                    Cancel
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