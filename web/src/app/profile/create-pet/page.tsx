"use client";
import {useState} from "react";
import { useRouter } from 'next/navigation';

type PetFormData ={
    name:string;
    species:string;
    breed:string;
    size:string;
    age:number;
    temperament: string[];
    bio:string;
}

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
  });
   function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? Math.max(0, Number(value)) : value,
    }));
  }

  function handleSpeciesToggle(species: string) {
    setFormData(prev => ({
      ...prev,
      species: species,
    }));
  }

  function handleSizeToggle(size: string) {
    setFormData(prev => ({
      ...prev,
      size: size,
    }));
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

    // Validate required fields
    if (!formData.name || !formData.species) {
      setError('Name and species are required');
      return;
    }
   return(
       <>
           {/* wrapper */}
           <main className = "min-h-screen bg-[#FDF6EE] md:px-6 md:py-10">
                <div className="mx-auto w-full max-w-md bg-white min-h-screen md:min-h-0 md:max-w-4xl md:rounded-2xl md:shadow-sm"> 
                    {/* header <- Add pet */}
                    <div className="flex items-center border-b border-[#E8DDD0] gap-[0.9rem] pt-12 px-5 pb-3 md:px-6">
                        <span className = "text-[1rem] text-[#1A1A2E] cursor-pointer lg:hidden">&larr;</span>
                        <span className = "text-[1rem] text-[#1A1A2E] md:text-[1.1rem] font-bold">Add Pet</span>
                    </div>
                    <form  onSubmit = {handleSubmit} className ="p-5 md:p-8">
                        {/* Photo upload section */}
                        <div className ="flex flex-col gap-6 md:grid md:grid-cols-[260px_1fr] md:gap-8">
                            <div 
                                className ="w-full h-[130px] flex flex-col items-center justify-center border-2 border-dashed rounded-2xl border-[#E8DDD0] bg-[#F9FAFB] md:h-[280px]"
                            >
                                <span className ="text-3xl md:text-4xl">📷</span>
                                <span className = "mt-2 text-sm text-gray-600">Upload Photo</span>
                            </div>
                            {/* Container for input content */} 
                            <div className = "flex flex-col gap-4">
                                {/* Name input */}
                                <div className = "flex flex-col">
                                    <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">
                                        Name
                                    </label>
                                    <input 
                                        type="text" 
                                        name = "name"
                                        value={formData.name}
                                        placeholder="Pet's name" 
                                        className = "w-full py-3 px-3.5 border-2 border-[#E5E7EB] rounded-lg outline-none text-[#1A1A2E] focus:border-[#E8734A]"
                                        onChange = {handleChange}
                                    />
                                </div>
                                {/* Species toggle */}
                                <div className = "flex flex-col">
                                    <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Species</label>
                                    {/* Button wrapper */}
                                    <div className = "grid grid-cols-2 gap-2">
                                        <button 
                                            type ="button"
                                            onClick = {() => {handleSpeciesToggle("dog")}}
                                            className = {`rounded-lg p-2.5 text-[#1A1A2E] ${
                                                formData.species === "dog" ? "bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]" : "border border-[#E8DDD0] bg-[white]"
                                            }`}
                                        >
                                            🐕 Dog
                                        </button>
                                        <button 
                                            type ="button"
                                            onClick = {() => {handleSpeciesToggle("cat")}}
                                            className = {`rounded-lg p-2.5 text-[#1A1A2E] ${
                                                formData.species === "cat" ? "bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]" : "border border-[#E8DDD0] bg-[white]"
                                            }`}
                                        >
                                            🐱 Cat
                                        </button>
                                    </div>
                                </div>
                                {/* Breed toggle */}
                                <div className = "flex flex-col">
                                    <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Breed</label>
                                    <input 
                                        type="text" 
                                        name = "breed"
                                        value = {formData.breed}
                                        placeholder="Pet's breed" 
                                        className = " w-full py-3 px-3.5 border-2 border-[#E5E7EB] rounded-lg outline-none text-[#1A1A2E] focus:border-[#E8734A]"
                                        onChange = {handleChange}
                                    />

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
          ageMonths: formData.age, // Convert age to ageMonths for schema
          temperament: formData.temperament,
          bio: formData.bio || null,
          photoUrls: [], // TODO: wire Cloudinary upload
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create pet');
      }

      // Success — redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* wrapper */}
      <main className="min-h-screen bg-[#FDF6EE] md:px-6 md:py-10">
        <div className="mx-auto w-full max-w-md bg-white min-h-screen md:min-h-0 md:max-w-4xl md:rounded-2xl md:shadow-sm">
          {/* header <- Add pet */}
          <div className="flex items-center border-b border-[#E8DDD0] gap-[0.9rem] pt-12 px-5 pb-3 md:px-6">
            <span className="text-[1rem] text-[#1A1A2E] cursor-pointer lg:hidden">&larr;</span>
            <span className="text-[1rem] text-[#1A1A2E] md:text-[1.1rem] font-bold">Add Pet</span>
          </div>

          {/* Error message */}
          {error && (
            <div className="mx-5 mt-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-5 md:p-8">
            {/* Photo upload section */}
            <div className="flex flex-col gap-6 md:grid md:grid-cols-[260px_1fr] md:gap-8">
              <div className="w-full h-[130px] flex flex-col items-center justify-center border-2 border-dashed rounded-2xl border-[#E8DDD0] bg-[#F9FAFB] md:h-[280px]">
                <span className="text-3xl md:text-4xl">📷</span>
                <span className="mt-2 text-sm text-gray-600">Upload Photo</span>
              </div>
              {/* Container for input content */}
              <div className="flex flex-col gap-4">
                {/* Name input */}
                <div className="flex flex-col">
                  <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">
                    Name
                  </label>
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
                {/* Species toggle */}
                <div className="flex flex-col">
                  <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">
                    Species
                  </label>
                  {/* Button wrapper */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleSpeciesToggle('dog');
                      }}
                      className={`rounded-lg p-2.5 text-[#1A1A2E] ${
                        formData.species === 'dog'
                          ? 'bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-[white]'
                      }`}
                    >
                      🐕 Dog
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleSpeciesToggle('cat');
                      }}
                      className={`rounded-lg p-2.5 text-[#1A1A2E] ${
                        formData.species === 'cat'
                          ? 'bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-[white]'
                      }`}
                    >
                      🐱 Cat
                    </button>
                  </div>
                </div>
                {/* Breed toggle */}
                <div className="flex flex-col">
                  <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">
                    Breed
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    placeholder="Pet's breed"
                    className="w-full py-3 px-3.5 border-2 border-[#E5E7EB] rounded-lg outline-none text-[#1A1A2E] focus:border-[#E8734A]"
                    onChange={handleChange}
                  />
                </div>
                {/* Pet size's toggle */}
                <div className="flex flex-col">
                  <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">
                    Size
                  </label>
                  {/* Button wrapper */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSizeToggle('S')}
                      className={`rounded-lg p-2.5 text-[#1A1A2E] ${
                        formData.size == 'S'
                          ? 'bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-[white]'
                      }`}
                    >
                      S
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSizeToggle('M')}
                      className={`rounded-lg p-2.5 text-[#1A1A2E] ${
                        formData.size == 'M'
                          ? 'bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-[white]'
                      }`}
                    >
                      M
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSizeToggle('L')}
                      className={`rounded-lg p-2.5 text-[#1A1A2E] ${
                        formData.size == 'L'
                          ? 'bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-[white]'
                      }`}
                    >
                      L
                    </button>
                  </div>
                </div>

                {/* Age */}
                <div className="flex flex-col">
                  <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">
                    Age (Months)
                  </label>
                  <input
                    name="age"
                    value={formData.age}
                    type="number"
                    className="w-full border border-[#E5E7EB] rounded-lg focus:ring-2 outline-none focus:ring-[#E8734A] text-[#1A1A2E] py-2 px-3"
                    onChange={handleChange}
                  />
                </div>

                {/* Temperament toggle*/}
                <div className="flex flex-col">
                  <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">
                    Temperament
                  </label>
                  {/* Button wrapper */}
                  <div className="flex flex-wrap gap-2">
                    {/* Clickable chips */}
                    <button
                      type="button"
                      onClick={() => handleTemperamentToggle('friendly')}
                      className={`py-2 px-3.5 text-[#1A1A2E] rounded-full cursor-pointer ${
                        formData.temperament.includes('friendly')
                          ? 'bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-[white]'
                      }`}
                    >
                      Friendly
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTemperamentToggle('playful')}
                      className={`py-2 px-3.5 text-[#1A1A2E] rounded-full cursor-pointer ${
                        formData.temperament.includes('playful')
                          ? 'bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-[white]'
                      }`}
                    >
                      Playful
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTemperamentToggle('shy')}
                      className={`py-2 px-3.5 text-[#1A1A2E] rounded-full cursor-pointer ${
                        formData.temperament.includes('shy')
                          ? 'bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-[white]'
                      }`}
                    >
                      Shy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTemperamentToggle('energetic')}
                      className={`py-2 px-3.5 text-[#1A1A2E] rounded-full cursor-pointer ${
                        formData.temperament.includes('energetic')
                          ? 'bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-[white]'
                      }`}
                    >
                      Energetic
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTemperamentToggle('calm')}
                      className={`py-2 px-3.5 text-[#1A1A2E] rounded-full cursor-pointer ${
                        formData.temperament.includes('calm')
                          ? 'bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-[white]'
                      }`}
                    >
                      Calm
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTemperamentToggle('curious')}
                      className={`py-2 px-3.5 text-[#1A1A2E] rounded-full cursor-pointer ${
                        formData.temperament.includes('curious')
                          ? 'bg-[#FFF1E8] border-2 border-[#E8734A] text-[#E8734A]'
                          : 'border border-[#E8DDD0] bg-[white]'
                      }`}
                    >
                      Curious
                    </button>
                  </div>
                </div>
                {/* AI section */}
                <div className="flex flex-col gap-2">
                  {/* Generate Bio with AI" button */}
                  <button
                    type="button"
                    className="w-full py-3 px-3.5 rounded-lg border-2 border-[#E8734A] bg-gradient-to-r from-[#FFD8C2] to-[#FFF1E8] text-[#E8734A] font-semibold"
                  >
                    ✨ Generate Bio with AI
                  </button>
                  {/* Bio text area */}
                  <textarea
                    name="bio"
                    value={formData.bio}
                    placeholder="Bio would appear here..."
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
                    className="hidden py-3 px-5 border border-[#E8734A] bg-[white] text-[#1A1A2E] rounded-lg cursor-pointer font-semibold lg:block"
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