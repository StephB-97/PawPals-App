"use client";
import { useState, useEffect } from "react";

export default function EventsPage() {
  
  type Event = {
    id: string;
    title: string;
    category: string;
    date: string;
    time: string;
    location: string;
    attending: number;
    image?: string;
  };

  const pills = [
    "All Events",
    "🎉 Social",
    "🎓 Training",
    "🎾 Fetch",
    "🥾 Hiking",
    "🏊 Swimming",
  ];
  
  const [active, setActive] = useState("All Events");
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data: Event[]) => setEvents(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredEvents =
    active === "All Events"
      ? events
      : events.filter((event) => {
          const category = active.split(" ").slice(1).join(" ");
          return event.category.toLowerCase() === category.toLowerCase();
        });

  return(
    <>
      <main className="min-h-screen bg-[#FDF6EE] p-8">
        <div className="text-[#3D2C2C] text-2xl font-bold">Events</div>
        <div className="text-[#A89279] mb-[20px]">
          {filteredEvents.length} paw-some event{filteredEvents.length !== 1 ? "s" : ""} nearby
        </div>
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
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="mb-[14px] overflow-hidden rounded-xl bg-white shadow-sm"
            >
              <div className="relative flex h-[140px] items-center justify-center bg-gradient-to-br from-[#C4A882] to-[#8B7355] text-5xl">
                {event.image || "🐕🌳"}

                <div className="absolute right-[10px] top-[10px] flex h-8 w-8 items-center justify-center rounded-full bg-white text-base shadow-md">
                  ♡
                </div>

                <div className="absolute bottom-[10px] left-[10px]">
                  <span className="rounded-full bg-[#E8734A] px-2 py-1 text-[11px] text-white">
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="px-4 py-[14px]">
                <div className="text-[16px] font-semibold text-[#3D2C2C]">
                  {event.title}
                </div>

                <div className="mt-[6px] text-[12px] text-[#A89279]">
                  📅 {event.date}
                </div>

                <div className="text-[12px] text-[#A89279]">
                  🕐 {event.time}
                </div>

                <div className="text-[12px] text-[#A89279]">
                  📍 {event.location}
                </div>

                <div className="text-[12px] text-[#A89279]">
                  👥 {event.attending} attending
                </div>
              </div>
            </div>
          ))}
        </div>
      </main> 
    </>

  )
}
