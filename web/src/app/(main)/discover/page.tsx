"use client";

import { useState } from "react";
import FilterPanel from "@/components/discover/FilterPanel";

export default function DiscoverPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

          <div className="grid min-h-[60vh] place-items-center rounded-xl border border-dashed border-[#E8DDD0] bg-[#FFFCF8] p-6 text-center">
            <p className="text-[#6B655F]">
              Pet discovery cards will appear here.
            </p>
          </div>
        </section>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/35 transition-opacity duration-300 md:hidden ${
          isMobileFilterOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
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
          <h2 className="text-lg font-semibold text-[#2E2925]">Filter Pets</h2>
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(false)}
            className="rounded-full border border-[#E8DDD0] px-3 py-1 text-sm text-[#6B655F]"
          >
            Close
          </button>
        </div>
        <div className="h-[calc(82vh-4rem)] overflow-y-auto pb-6">
          <FilterPanel onApply={() => setIsMobileFilterOpen(false)} />
        </div>
      </div>
    </div>
  );
}
