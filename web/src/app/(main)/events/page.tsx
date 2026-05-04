"use client";
import { useState } from "react";

export default function EventsPage() {
  const pills = [
    "All Events",
    "🎉 Social",
    "🎓 Training",
    "🎾 Fetch",
    "🥾 Hiking",
    "🏊 Swimming",
  ];
  const [active, setActive] = useState("All Events");
  return(
    <>
      <main className="min-h-screen bg-[#FDF6EE] p-8">
        <div className="text-[#3D2C2C] text-2xl font-bold">Events</div>
        <div className="text-[#A89279] mb-[20px]">6 paw-some events nearby</div>
        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto">
          {pills.map((pill, index) => {
            return (
              <button
                key={index}
                onClick={() => setActive(pill)}
                className={`px-4 py-2 rounded-full border text-sm ${
                  active === pill ? 
                  "bg-[#E8734A] text-white border-[#E8734A]": "bg-white text-[#3D2C2C] border-[#E8DDD0]"
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>
      </main> 
    </>

  )
}
