'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import PetCard from '@/components/pets/PetCard';
import ErrorState from '@/components/ui/ErrorState';

type Pet = {
  id: string;
  name: string;
  breed: string | null;
  species: string;
};

type OwnerResponse = {
  displayName: string;
  neighborhood: string | null;
  city: string | null;
  pets: Pet[];
};

export default function ProfilePage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [owner, setOwner] = useState<OwnerResponse | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setErrorMessage(null);
    try {
      const res = await fetch('/api/owners/me');
      if (res.status === 404) {
        router.replace('/onboarding');
        return;
      }
      if (!res.ok) {
        let msg = 'Something went wrong. Please try again.';
        try {
          const data = (await res.json()) as { error?: string };
          if (data.error) msg = data.error;
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }
      const data = (await res.json()) as OwnerResponse;
      setOwner(data);
      setStatus('ready');
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FDF6EE]">
        <p className="text-gray-600">Loading your profile…</p>
      </main>
    );
  }

  if (status === 'error' && errorMessage) {
    return (
      <main className="min-h-screen bg-[#FDF6EE] px-4 py-10">
        <div className="mx-auto max-w-md">
          <ErrorState message={errorMessage} onRetry={() => void load()} />
        </div>
      </main>
    );
  }

  if (!owner) {
    return null;
  }

  const pets = owner.pets ?? [];
  const locationLabel = [owner.neighborhood, owner.city].filter(Boolean).join(', ') || 'Welcome to PawPals';

  return (
    <main className="min-h-screen bg-[#FDF6EE] lg:px-8 lg:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:grid lg:grid-cols-[320px_1fr] lg:items-start">
        <div>
          <div className="flex flex-col bg-white pt-6 lg:rounded-2xl lg:p-6">
            <div className="flex flex-col items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E8734A] text-2xl font-bold text-white">
                {owner.displayName.charAt(0).toUpperCase()}
              </div>
              <h2 className="mt-3 text-xl font-bold text-[#1A1A2E]">{owner.displayName}</h2>
              <p className="text-sm text-gray-600">{locationLabel}</p>
              <button
                type="button"
                className="mt-3 cursor-pointer rounded-[10px] border-2 border-[#E8734A] bg-white px-5 py-2 text-[13px] font-semibold text-[#E8734A]"
              >
                Edit Profile
              </button>
            </div>
          </div>
          <div className="mt-4 bg-white p-4 shadow-sm sm:p-5 lg:rounded-2xl">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-xl border border-[#E8DDD0] p-3">
                <h2 className="text-2xl font-bold text-[#FF6B6B]">{pets.length}</h2>
                <span className="text-gray-600">Pets</span>
              </div>
              <div className="rounded-xl border border-[#E8DDD0] p-3">
                <h2 className="text-2xl font-bold text-[#FF6B6B]">—</h2>
                <span className="text-gray-600">Matches</span>
              </div>
              <div className="rounded-xl border border-[#E8DDD0] p-3">
                <h2 className="text-2xl font-bold text-[#FF6B6B]">—</h2>
                <span className="text-gray-600">Events</span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 pb-6 md:px-10">
          <section className="mt-6 lg:mt-0">
            <h2 className="mb-3 text-base font-semibold text-gray-900">My Pets</h2>
            {pets.length === 0 ? (
              <p className="text-gray-600">
                No pets yet.{' '}
                <Link href="/profile/create-pet" className="font-medium text-[#E8734A] hover:underline">
                  Add a pet
                </Link>
              </p>
            ) : (
              <div className="mt-4 flex flex-col items-center gap-4 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {pets.map(pet => (
                  <div key={pet.id} className="relative w-fit">
                    <PetCard
                      name={pet.name}
                      breed={pet.breed ?? ''}
                      species={pet.species === 'cat' ? 'cat' : 'dog'}
                    />
                    <Link
                      href={`/profile/edit-pet/${pet.id}`}
                      className="absolute right-3 top-3 text-xs font-medium text-orange-500 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
          <div className="flex w-full justify-center pt-4 lg:hidden">
            <SignOutButton>
              <button
                type="button"
                className="w-full rounded-lg border-2 border-[#E5E7EB] p-3 text-[#6B7280]"
              >
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </main>
  );
}
