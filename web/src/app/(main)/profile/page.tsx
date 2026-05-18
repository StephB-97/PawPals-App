"use client";

import { useEffect, useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import PetCard from "@/components/pets/PetCard";
import Link from "next/link";

type Pet = {
  id: string;
  name: string;
  breed: string;
  species: "dog" | "cat";
  photoUrls: string[];
};

type Owner = {
  displayName: string;
  neighborhood: string;
  city: string;
  pets: Pet[];
};

export default function ProfilePage() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/owners/me")
      .then((res) => res.json())
      .then((data) => {
        setOwner(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#FDF6EE] p-8 text-[#A89279]">Loading...</div>;
  }

  if (!owner) {
    return <div className="min-h-screen bg-[#FDF6EE] p-8 text-[#A89279]">Could not load profile.</div>;
  }

  const pets = owner.pets || [];

  return (
    <main className="min-h-screen bg-[#FDF6EE] lg:px-8 lg:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:grid lg:grid-cols-[320px_1fr] lg:items-start">
        <div>
          <div className="flex flex-col bg-white pt-6 lg:rounded-2xl lg:p-6">
            <div className="flex flex-col items-center justify-center">
              <div className="rounded-full h-20 w-20 text-white text-2xl font-bold bg-[#E8734A] flex items-center justify-center">
                {owner.displayName?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <h2 className="mt-3 text-xl font-bold text-[#1A1A2E]">{owner.displayName}</h2>
              <p className="text-sm text-gray-600">
                {owner.neighborhood}{owner.city ? `, ${owner.city}` : ""}
              </p>
            </div>
          </div>
          <div className="lg:mt-4 lg:rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-xl border border-[#E8DDD0] p-3">
                <h2 className="text-[#FF6B6B] font-bold text-2xl">{pets.length}</h2>
                <span className="text-gray-600">Pets</span>
              </div>
              <div className="rounded-xl border border-[#E8DDD0] p-3">
                <h2 className="text-[#FF6B6B] font-bold text-2xl">0</h2>
                <span className="text-gray-600">Matches</span>
              </div>
              <div className="rounded-xl border border-[#E8DDD0] p-3">
                <h2 className="text-[#FF6B6B] font-bold text-2xl">0</h2>
                <span className="text-gray-600">Events</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-6 md:px-10">
          <section className="mt-6 lg:mt-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-900">My Pets</h2>
              <Link
                href="/profile/create-pet"
                className="rounded-full bg-[#E8734A] px-4 py-2 text-sm font-semibold text-white"
              >
                + Add Pet
              </Link>
            </div>
            <div className="mt-4 flex flex-col items-center gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {pets.map((pet) => (
                <div key={pet.id} className="relative w-fit">
                  <PetCard name={pet.name} breed={pet.breed || ""} species={pet.species} photoUrl={pet.photoUrls?.[0]} />
                  <Link
                    href={`/profile/edit-pet/${pet.id}`}
                    className="absolute right-3 top-3 text-xs font-medium text-orange-500 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-center pt-6 w-full">
            <SignOutButton>
              <button className="w-full rounded-lg p-3 border-2 border-[#E5E7EB] text-[#6B7280]">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </main>
  );
}