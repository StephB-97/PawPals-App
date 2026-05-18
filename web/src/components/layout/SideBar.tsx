"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-56 flex-col border-r border-[#E8DDD0] bg-white">
      <div className="px-5 py-6">
        <Link href="/" className="text-xl font-bold text-[#E8734A]">
          🐾 PawPals
        </Link>
      </div>
      <nav className="flex flex-col gap-1 px-3">
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
                  : "text-[#6B655F] hover:bg-[#FAF6F1]"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}