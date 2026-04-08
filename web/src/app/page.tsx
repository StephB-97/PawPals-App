import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDF6EE] text-[#3D2C2C]">
      <Navbar />

      <section className="px-6 py-10 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h1 className="max-w-xl text-5xl font-bold leading-tight md:text-7xl">
              Meet your next
              <br />
              best friend!
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#8B7355] md:text-lg">
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

      <section
        id="features"
        className="border-t border-[#E8DDD0] bg-white px-6 py-10 md:px-10 md:py-14"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-[#E8DDD0] bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-4xl">❤️</div>
            <h2 className="text-2xl font-semibold text-[#3D2C2C]">
              Discover &amp; Match
            </h2>
            <p className="mt-3 text-base leading-7 text-[#8B7355]">
              Swipe through nearby pets and match when it&apos;s mutual.
            </p>
          </div>

          <div className="rounded-3xl border border-[#E8DDD0] bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-4xl">📍</div>
            <h2 className="text-2xl font-semibold text-[#3D2C2C]">
              Explore Nearby
            </h2>
            <p className="mt-3 text-base leading-7 text-[#8B7355]">
              Find pals on an interactive map with privacy protection.
            </p>
          </div>

          <div className="rounded-3xl border border-[#E8DDD0] bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-4xl">📅</div>
            <h2 className="text-2xl font-semibold text-[#3D2C2C]">
              Community Events
            </h2>
            <p className="mt-3 text-base leading-7 text-[#8B7355]">
              Join pet meetups, training sessions, and social gatherings.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="px-6 py-10 text-center md:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold">About PawPals</h2>
          <p className="mt-4 text-lg text-[#8B7355]">
            PawPals helps pet owners connect with others nearby for safe,
            friendly playdates, walks, and local events.
          </p>
        </div>
      </section>
    </main>
  );
}