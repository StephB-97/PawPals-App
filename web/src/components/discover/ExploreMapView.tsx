"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import Image from "next/image";

type SpeciesFilter = "all" | "dog" | "cat";

type MapPet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  photoUrl: string | null;
  latitude: number;
  longitude: number;
  distanceMiles: number;
};

const DEFAULT_CENTER: [number, number] = [-74.006, 40.7128];

const filterPills: Array<{ label: string; value: SpeciesFilter }> = [
  { label: "All Pets", value: "all" },
  { label: "Dogs", value: "dog" },
  { label: "Cats", value: "cat" },
];

function normalizeSpecies(species: string) {
  const lowered = species.toLowerCase();
  if (lowered.includes("dog")) return "dog";
  if (lowered.includes("cat")) return "cat";
  return "other";
}

function getPetEmoji(species: string) {
  return normalizeSpecies(species) === "dog" ? "🐕" : "🐱";
}

export default function ExploreMapView() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesFilter>("all");
  const [pets, setPets] = useState<MapPet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState<string | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token || !mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: DEFAULT_CENTER,
      zoom: 11,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          map.flyTo({
            center: [coords.longitude, coords.latitude],
            zoom: 12,
            essential: true,
          });
        },
        () => {
          return;
        }
      );
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    async function loadPets() {
      setIsLoading(true);
      setRequestError(null);

      try {
        let endpoint = "/api/discover/map";
        if (selectedSpecies !== "all") {
          endpoint += `?species=${selectedSpecies}`;
        }

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to load map pets");
        }

        const data = (await response.json()) as MapPet[];
        setPets(data);
      } catch {
        setRequestError("Unable to load nearby pets right now.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPets();
  }, [selectedSpecies]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    pets.forEach((pet) => {
      const markerElement = document.createElement("button");
      markerElement.type = "button";
      markerElement.className =
        "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#E8734A] text-lg shadow-md";
      markerElement.textContent = getPetEmoji(pet.species);
      markerElement.setAttribute("aria-label", `View ${pet.name}`);
      markerElement.addEventListener("click", () => {
        setSelectedPetId(pet.id);
      });

      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([pet.longitude, pet.latitude])
        .addTo(mapRef.current as mapboxgl.Map);

      markersRef.current.push(marker);
    });
  }, [pets]);

  const selectedPet = useMemo(
    () => pets.find((pet) => pet.id === selectedPetId) ?? null,
    [pets, selectedPetId]
  );

  if (!token) {
    return (
      <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        Add `NEXT_PUBLIC_MAPBOX_TOKEN` to `web/.env` and restart Next.js.
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-8.5rem)] min-h-[620px] overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white">
      <div className="absolute left-3 right-3 top-3 z-20 flex flex-wrap gap-2">
        {filterPills.map((pill) => {
          const active = selectedSpecies === pill.value;
          return (
            <button
              key={pill.value}
              type="button"
              onClick={() => setSelectedSpecies(pill.value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                active
                  ? "border-[#E8734A] bg-[#FFF3EE] text-[#E8734A]"
                  : "border-[#E8DDD0] bg-white/90 text-[#6B655F]"
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      <div ref={mapContainerRef} className="h-full w-full" />

      {isLoading && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-white/65">
          <p className="text-sm font-medium text-[#6B655F]">Loading map pets...</p>
        </div>
      )}

      {requestError && (
        <div className="absolute bottom-4 left-4 right-4 z-20 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {requestError}
        </div>
      )}

      {selectedPet && (
        <div className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl border border-[#E8DDD0] bg-white p-3 shadow-lg">
          <div className="flex items-center gap-3">
            {selectedPet.photoUrl ? (
              <Image
                src={selectedPet.photoUrl}
                alt={selectedPet.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-xl object-cover"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-xl bg-[#FFF3EE] text-2xl">
                {getPetEmoji(selectedPet.species)}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-[#2E2925]">
                {selectedPet.name}
              </p>
              <p className="truncate text-sm text-[#6B655F]">
                {selectedPet.breed ?? "Breed not listed"}
              </p>
              <p className="text-sm text-[#6B655F]">
                {selectedPet.distanceMiles} mi away
              </p>
            </div>

            <button
              type="button"
              className="rounded-full border border-[#E8DDD0] p-2 text-lg"
              aria-label={`Like ${selectedPet.name}`}
            >
              ❤️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
