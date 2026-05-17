import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Home() {
  const user = await currentUser();

  if (user?.id) {
    const owner = await prisma.owner.findUnique({
      where: { clerkId: user.id },
    });

    if (!owner || !owner.displayName || !owner.neighborhood) {
      redirect('/onboarding');
    }

    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-[#FDF6EE] text-[#3D2C2C]">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD0]">
        <span className="text-xl font-bold">🐾 PawPals</span>
        <div className="flex gap-3">
          <Link href="/sign-in" className="px-4 py-2 text-sm font-medium text-[#3D2C2C] hover:opacity-80">
            Sign In
          </Link>
          <Link href="/sign-up" className="px-4 py-2 text-sm font-semibold text-white bg-[#E8734A] rounded-full hover:opacity-90">
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="px-6 py-10 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h1 className="max-w-xl text-5xl font-bold leading-tight md:text-7xl">
              Meet your next
              <br />
              best friend!
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#8B7355]">
              Discover nearby pets for playdates, walks, and friendship.
              <br />
              Swipe, match, and connect with pet owners in your neighborhood.
            </p>
            <Link
              href="/sign-up"
              className="mt-8 inline-block rounded-full bg-[#E8734A] px-8 py-4 text-lg font-semibold text-white transition hover:opacity-90"
            >
              Get Started Free
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="flex h-72 w-72 items-center justify-center rounded-full bg-[#D4A128] shadow-sm md:h-[430px] md:w-[430px]">
              <span className="text-8xl md:text-[160px]">🐕</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E8DDD0] bg-white px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-[#E8DDD0] bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-4xl">❤️</div>
            <h2 className="text-2xl font-semibold">Discover &amp; Match</h2>
            <p className="mt-3 text-base leading-7 text-[#8B7355]">
              Swipe through nearby pets and match when it&apos;s mutual.
            </p>
          </div>
          <div className="rounded-3xl border border-[#E8DDD0] bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-4xl">📍</div>
            <h2 className="text-2xl font-semibold">Explore Nearby</h2>
            <p className="mt-3 text-base leading-7 text-[#8B7355]">
              Find pets on the map and see who&apos;s in your neighborhood.
            </p>
          </div>
          <div className="rounded-3xl border border-[#E8DDD0] bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-4xl">🎉</div>
            <h2 className="text-2xl font-semibold">Join Events</h2>
            <p className="mt-3 text-base leading-7 text-[#8B7355]">
              Attend pet-friendly meetups, walks, and playdates.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}