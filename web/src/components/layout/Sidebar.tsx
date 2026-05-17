"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

const tabs = [
  { href: "/discover", icon: "❤️", label: "Discover" },
  { href: "/matches", icon: "💬", label: "Matches" },
  { href: "/explore", icon: "📍", label: "Explore" },
  { href: "/events", icon: "📅", label: "Events" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col border-r border-[#E8DDD0] bg-white px-6 py-8">
      <div className="mb-10">
        <Link href="/discover" className="text-2xl font-bold text-[#E8734A]">
          PawPals
        </Link>
      </div>

      <nav className="flex flex-col gap-2">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-[#FFF3EE] text-[#E8734A]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <SignOutButton redirectUrl="/">
          <button className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-500">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}