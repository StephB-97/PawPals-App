"use client";
import { useState, useEffect } from "react";
import RSVPButton from "./RSVPButton";

type PawPalsEvent = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  attending: number;
  image?: string;
};

type CreateEventFormData = {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  locationName: string;
  speciesAllowed: string;
  tags: string[];
};

const tagOptions = ["Social", "Training", "Fetch", "Hiking", "Swimming", "Outdoor", "Indoor"];

function CreateEventModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [formData, setFormData] = useState<CreateEventFormData>({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    locationName: "",
    speciesAllowed: "both",
    tags: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function toggleTag(tag: string) {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to create event");
      onCreated();
      onClose();
    } catch {
      alert("Something went wrong creating the event.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white md:rounded-2xl">
        <div className="flex items-center justify-between border-b border-[#E8DDD0] px-5 py-4">
          <span className="text-base font-bold text-[#3D2C2C]">Create Event</span>
          <button type="button" onClick={onClose} className="text-[#A89279] text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#3D2C2C]">Event Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required placeholder="Central Park Dog Walk" className="rounded-lg border-2 border-[#E5E7EB] px-3.5 py-3 text-[#1A1A2E] outline-none focus:border-[#E8734A]" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#3D2C2C]">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Describe your event..." rows={3} className="rounded-lg border-2 border-[#E5E7EB] px-3.5 py-3 text-[#1A1A2E] outline-none focus:border-[#E8734A] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#3D2C2C]">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required className="rounded-lg border-2 border-[#E5E7EB] px-3 py-3 text-[#1A1A2E] outline-none focus:border-[#E8734A]" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#3D2C2C]">Start Time</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="rounded-lg border-2 border-[#E5E7EB] px-3 py-3 text-[#1A1A2E] outline-none focus:border-[#E8734A]" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#3D2C2C]">Location</label>
            <input name="locationName" value={formData.locationName} onChange={handleChange} placeholder="e.g. Central Park, NYC" className="rounded-lg border-2 border-[#E5E7EB] px-3.5 py-3 text-[#1A1A2E] outline-none focus:border-[#E8734A]" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#3D2C2C]">Species Allowed</label>
            <div className="flex gap-2">
              {["dogs", "cats", "both"].map((option) => (
                <button key={option} type="button" onClick={() => setFormData((prev) => ({ ...prev, speciesAllowed: option }))} className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${formData.speciesAllowed === option ? "bg-[#E8734A] text-white" : "border border-[#E8DDD0] bg-white text-[#3D2C2C]"}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#3D2C2C]">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`rounded-full px-3 py-1.5 text-sm ${formData.tags.includes(tag) ? "bg-[#E8734A] text-white" : "border border-[#E8DDD0] bg-white text-[#3D2C2C]"}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-gradient-to-br from-[#FF6B6B] to-[#FF8C42] py-3 font-semibold text-white disabled:opacity-50">
            {isSubmitting ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const pills = ["All Events", "🎉 Social", "🎓 Training", "🎾 Fetch", "🥾 Hiking", "🏊 Swimming"];
  const [active, setActive] = useState("All Events");
  const [events, setEvents] = useState<PawPalsEvent[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  function loadEvents() {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data: PawPalsEvent[]) => setEvents(data))
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents =
    active === "All Events"
      ? events
      : events.filter((event) => {
          const category = active.split(" ").slice(1).join(" ");
          return event.category.toLowerCase() === category.toLowerCase();
        });

  return (
    <>
      <main className="min-h-screen bg-[#FDF6EE] p-8">
        <div className="flex items-center justify-between">
          <div className="text-[#3D2C2C] text-2xl font-bold">Events</div>
          <button onClick={() => setShowCreateModal(true)} className="rounded-full bg-[#E8734A] px-4 py-2 text-sm font-semibold text-white shadow-sm">
            + Create
          </button>
        </div>
        <div className="text-[#A89279] mb-[20px]">
          {filteredEvents.length} paw-some event{filteredEvents.length !== 1 ? "s" : ""} nearby
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {pills.map((pill, index) => (
            <button key={index} onClick={() => setActive(pill)} className={`px-4 py-2 rounded-full border text-sm ${active === pill ? "bg-[#E8734A] text-white border-[#E8734A]" : "bg-white text-[#3D2C2C] border-[#E8DDD0]"}`}>
              {pill}
            </button>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredEvents.map((event) => (
            <div key={event.id} className="mb-[14px] overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="relative flex h-[140px] items-center justify-center bg-gradient-to-br from-[#C4A882] to-[#8B7355] text-5xl">
                {event.image || "🐕🌳"}
                <div className="absolute right-[10px] top-[10px] flex h-8 w-8 items-center justify-center rounded-full bg-white text-base shadow-md">♡</div>
                <div className="absolute bottom-[10px] left-[10px]">
                  <span className="rounded-full bg-[#E8734A] px-2 py-1 text-[11px] text-white">{event.category}</span>
                </div>
              </div>
              <div className="px-4 py-[14px]">
                <div className="text-[16px] font-semibold text-[#3D2C2C]">{event.title}</div>
                <div className="mt-[6px] text-[12px] text-[#A89279]">📅 {event.date}</div>
                <div className="text-[12px] text-[#A89279]">🕐 {event.time}</div>
                <div className="text-[12px] text-[#A89279]">📍 {event.location}</div>
                <div className="text-[12px] text-[#A89279]">👥 {event.attending} attending</div>
                <div className="mt-3">
                  <RSVPButton eventId={event.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      {showCreateModal && (
        <CreateEventModal onClose={() => setShowCreateModal(false)} onCreated={loadEvents} />
      )}
    </>
  );
}