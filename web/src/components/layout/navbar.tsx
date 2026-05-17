import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-[#E8DDD0] bg-[#FDF6EE] px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Left: Logo */}
        <Link
          href="/"
          className="text-3xl font-bold text-[#E8734A]"
        >
          🐾 PawPals
        </Link>

        {/* Right: Navigation (desktop) */}
        <div className="hidden items-center gap-6 md:flex">
          
          <a
            href="#features"
            className="text-base font-medium text-[#8B7355] hover:text-[#3D2C2C] transition"
          >
            Features
          </a>

          <a
            href="#about"
            className="text-base font-medium text-[#8B7355] hover:text-[#3D2C2C] transition"
          >
            About
          </a>

          <Link
            href="/sign-in"
            className="rounded-xl border-2 border-[#E8734A] px-5 py-2 text-sm font-semibold text-[#E8734A] transition hover:bg-[#E8734A] hover:text-white"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="rounded-xl bg-[#E8734A] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile: only Sign In */}
        <Link
          href="/sign-in"
          className="text-sm font-semibold text-[#E8734A] md:hidden"
        >
          Sign In
        </Link>

      </div>
    </nav>
  );
}