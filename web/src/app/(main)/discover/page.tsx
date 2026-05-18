"use client";

import { useEffect, useState } from "react";
import FilterPanel from "@/components/discover/FilterPanel";

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  size: string | null;
  ageMonths: number;
  bio: string | null;
  photoUrls: string[];
  temperament: string[];
  distanceMiles: number;
};

export default function DiscoverPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/discover/swipe")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load pets");
        return res.json();
      })
      .then((data) => {
        setPets(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const currentPet = pets[currentIndex] || null;

  async function handleSwipe(liked: boolean) {
    if (!currentPet) return;

    try {
      const ownerRes = await fetch("/api/owners/me");
      const owner = await ownerRes.json();
      const myPetId = owner.pets?.[0]?.id;

      if (myPetId) {
        await fetch("/api/matches/swipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            petAId: myPetId,
            petBId: currentPet.id,
            liked,
          }),
        });
      }
    } catch (err) {
      console.error("Swipe failed:", err);
    }

    setCurrentIndex((prev) => prev + 1);
  }

  function getEmoji(species: string) {
    return species === "cat" ? "🐱" : "🐕";
  }

  return (
    <div className="relative min-h-screen bg-[#FAF6F1] p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:flex-row md:gap-6">
        <aside className="hidden w-72 shrink-0 md:block">
          <FilterPanel />
        </aside>

        <section className="flex-1 rounded-2xl border border-[#E8DDD0] bg-white p-5 shadow-sm">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-[#2E2925]">Discover</h1>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="rounded-full border border-[#E8DDD0] p-2 text-xl leading-none md:hidden"
              aria-label="Open filters"
            >
              ⚙️
            </button>
          </header>

          {loading ? (
            <div className="grid min-h-[60vh] place-items-center">
              <p className="text-[#6B655F]">Loading nearby pets...</p>
            </div>
          ) : error ? (
            <div className="grid min-h-[60vh] place-items-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : !currentPet ? (
            <div className="grid min-h-[60vh] place-items-center rounded-xl border border-dashed border-[#E8DDD0] bg-[#FFFCF8] p-6 text-center">
              <div>
                <p className="text-4xl mb-3">🐾</p>
                <p className="text-[#6B655F] text-lg font-medium">No more pets nearby!</p>
                <p className="text-[#A89279] text-sm mt-1">Check back later for new friends.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {/* Pet Card */}
              <div className="w-full max-w-sm rounded-2xl border border-[#E8DDD0] bg-white shadow-md overflow-hidden">
                {/* Photo or emoji */}
                {currentPet.photoUrls?.length > 0 ? (
                  <img
                    src={currentPet.photoUrls[0]}
                    alt={currentPet.name}
                    className="h-72 w-full object-cover"
                  />
                ) : (
                  <div className="h-72 w-full flex items-center justify-center bg-gradient-to-br from-[#FFE8D6] to-[#FFF3EE] text-8xl">
                    {getEmoji(currentPet.species)}
                  </div>
                )}

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#2E2925]">{currentPet.name}</h2>
                    <span className="text-sm text-[#A89279]">{currentPet.distanceMiles} mi away</span>
                  </div>
                  <p className="text-sm text-[#6B655F] mt-1">
                    {currentPet.breed || currentPet.species} · {currentPet.size || "?"} · {currentPet.ageMonths < 12 ? `${currentPet.ageMonths}mo` : `${Math.floor(currentPet.ageMonths / 12)}yr`}
                  </p>
                  {currentPet.bio && (
                    <p className="text-sm text-[#6B655F] mt-3">{currentPet.bio}</p>
                  )}
                  {currentPet.temperament?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {currentPet.temperament.map((t) => (
                        <span key={t} className="rounded-full bg-[#FFF3EE] border border-[#E8DDD0] px-3 py-1 text-xs text-[#E8734A] capitalize">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Swipe Buttons */}
              <div className="flex gap-6 mt-6">
                <button
                  onClick={() => handleSwipe(false)}
                  className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#E8DDD0] bg-white text-2xl shadow-md transition hover:scale-110"
                  aria-label="Pass"
                >
                  ✕
                </button>
                <button
                  onClick={() => handleSwipe(true)}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8734A] text-2xl text-white shadow-md transition hover:scale-110"
                  aria-label="Like"
                >
                  ❤️
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Mobile filter overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/35 transition-opacity duration-300 md:hidden ${
          isMobileFilterOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMobileFilterOpen(false)}
        aria-hidden
      />

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 h-[82vh] max-h-[720px] rounded-t-3xl bg-[#FAF6F1] p-4 transition-transform duration-300 md:hidden ${
          isMobileFilterOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#2E2925]">Filters</h2>
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(false)}
            className="text-xl text-[#A89279]"
          >
            ✕
          </button>
        </div>
        <FilterPanel />
      </div>
    </div>
  );
}
