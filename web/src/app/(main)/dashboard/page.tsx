import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import PetCard from '@/components/pets/PetCard';

export default async function DashboardPage() {
  const user = await currentUser();
  const userName = user?.firstName || user?.username || 'Friend';

  if (!user?.id) {
    redirect('/sign-in');
  }

  const owner = await prisma.owner.findUnique({
    where: { clerkId: user.id },
    include: {
      pets: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!owner) {
    redirect('/onboarding');
  }

  const pets = owner.pets || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold">Hey, {userName}! 👋</h1>
        <p className="text-gray-600">{owner.neighborhood || 'Welcome to PawPals'}</p>
      </div>

      <div className="p-4 md:p-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Pets ({pets.length})</h2>
            <Link href="/profile/create-pet">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                + Add Pet
              </button>
            </Link>
          </div>

          {pets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map(pet => (
                <PetCard key={pet.id} name={pet.name} breed={pet.breed || ''} species={pet.species as 'dog' | 'cat'} />
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
              <p className="text-gray-700 text-lg mb-4">
                Add your first pet to get started! 🐾
              </p>
              <Link href="/profile/create-pet">
                <button className="bg-blue-600 text-white px-6 py-2 rounded">
                  Create Your First Pet
                </button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}