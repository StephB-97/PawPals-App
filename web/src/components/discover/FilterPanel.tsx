"use client";

import { useFilterStore } from "@/lib/stores/filterStore";

type FilterPanelProps = {
  onApply?: () => void;
};

const speciesOptions = [
  { label: "All Pets", value: "all" },
  { label: "Dogs", value: "dogs" },
  { label: "Cats", value: "cats" },
] as const;

const sizeOptions = ["S", "M", "L"] as const;

export default function FilterPanel({ onApply }: FilterPanelProps) {
  const {
    species,
    sizes,
    maxDistance,
    setSpecies,
    toggleSize,
    setMaxDistance,
    applyFilters,
  } = useFilterStore();

  const handleApply = () => {
    applyFilters();
    onApply?.();
  };

  return (
    <section className="flex h-full flex-col rounded-2xl border border-[#E8DDD0] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#2E2925]">Filters</h2>

      <div className="mt-5 space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[#6B655F]">Species</h3>
          <div className="flex flex-wrap gap-2">
            {speciesOptions.map((option) => {
              const isActive = species === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSpecies(option.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-[#E8734A] bg-[#FFF3EE] text-[#E8734A]"
                      : "border-[#E8DDD0] bg-white text-[#6B655F] hover:border-[#E8734A]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-[#6B655F]">Size</h3>
          <div className="flex gap-2">
            {sizeOptions.map((option) => {
              const isActive = sizes.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleSize(option)}
                  className={`min-w-11 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-[#E8734A] bg-[#FFF3EE] text-[#E8734A]"
                      : "border-[#E8DDD0] bg-white text-[#6B655F] hover:border-[#E8734A]"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#6B655F]">Distance</h3>
            <span className="text-sm font-medium text-[#2E2925]">
              {maxDistance} mi
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={25}
            value={maxDistance}
            onChange={(event) => setMaxDistance(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#EFE7DD]"
          />
          <div className="mt-2 flex justify-between text-xs text-[#9A938C]">
            <span>1 mi</span>
            <span>25 mi</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleApply}
        className="mt-8 rounded-xl bg-[#E8734A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#D86842]"
      >
        Apply Filters
      </button>
    </section>
  );
}
