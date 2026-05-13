"use client";

import { useEffect, useState } from "react";

type Match = {
  id: string;
  name: string;
  breed: string;
  image?: string;
  isNew?: boolean;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch("/api/matches")
      .then((res) => res.json())
      .then((data: Match[]) => setMatches(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF6EE] p-8">
      <div className="text-[#3D2C2C] text-2xl font-bold">Matches</div>
      <div className="text-[#A89279] mb-[20px]">
        {matches.length} paws matched ·{" "}
        {matches.filter((m) => m.isNew).length} new
      </div>
      {/* Search bar */}
      <div className="relative mb-6">
        <span className="absolute left-[14px] top-1/2 -translate-y-1/2">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search matches..."
          className="bg-[#F0EBE3] w-full py-[12px] pr-[14px] pl-[40px] rounded-lg text-gray-700"
        />
      </div>
      {/* Cards */}
      {matches.length === 0 ? (
        <div className="text-[#A89279] mt-10 text-center">
          No matches yet. Keep swiping!
        </div>
      ) : (
        matches.map((match) => (
          <div
            key={match.id}
            className="flex items-center gap-[14px] bg-white px-[16px] py-[14px] mb-[10px] rounded-xl"
          >
            {/* Pet image */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A854] to-[#B8860B] text-xl">
              {match.image || "🐕"}
            </div>

            {/* Text */}
            <div className="flex-1">
              <div className="flex items-center gap-[6px]">
                <span className="text-[15px] font-semibold text-[#3D2C2C]">
                  {match.name}
                </span>

                {match.isNew && (
                  <span className="h-2 w-2 rounded-full bg-orange-400"></span>
                )}
              </div>

              <div className="text-[12px] text-[#A89279]">
                {match.breed}
              </div>

              <div className="text-[12px] text-[#A89279] mt-[2px]">
                Let&apos;s be friends!
              </div>
            </div>

            {/* Arrow */}
            <div className="text-[18px] text-orange-400">→</div>
          </div>
        ))
      )}
    </div>
  );
}