import { create } from "zustand";

type SpeciesFilter = "all" | "dogs" | "cats" | null;
type SizeFilter = "S" | "M" | "L";

type FilterState = {
  species: SpeciesFilter;
  sizes: SizeFilter[];
  maxDistance: number;
  setSpecies: (species: SpeciesFilter) => void;
  toggleSize: (size: SizeFilter) => void;
  setMaxDistance: (distance: number) => void;
  applyFilters: () => void;
};

export const useFilterStore = create<FilterState>((set) => ({
  species: "all",
  sizes: [],
  maxDistance: 25,
  setSpecies: (species) => set({ species }),
  toggleSize: (size) =>
    set((state) => {
      const nextSizes = state.sizes.includes(size)
        ? state.sizes.filter((selectedSize) => selectedSize !== size)
        : [...state.sizes, size];

      return { sizes: nextSizes };
    }),
  setMaxDistance: (distance) => set({ maxDistance: distance }),
  applyFilters: () => {
    // Placeholder action hook for discovery fetch integration.
    return;
  },
}));
