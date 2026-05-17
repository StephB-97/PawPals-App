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

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8DDD0] bg-white md:hidden">
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`flex flex-col items-center justify-center py-2 text-xs font-medium ${
                  isActive ? "text-[#E8734A]" : "text-gray-500"
                }`}
              >
                <span className="text-lg leading-none">{tab.icon}</span>
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
