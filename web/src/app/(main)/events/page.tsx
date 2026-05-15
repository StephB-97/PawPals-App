"use client";
import { useState, useEffect } from "react";

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

type CreateEventFormData = {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  tags: string[];
};

function CreateEventModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<CreateEventFormData>({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    tags: [],
  });
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [tagError, setTagError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSuggestTags =
    formData.title.trim().length > 0 && formData.description.trim().length > 0;

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSuggestTags() {
    if (!canSuggestTags || isSuggestingTags) return;
    setIsSuggestingTags(true);
    setTagError("");
    setSuggestedTags([]);
    try {
      const res = await fetch("/api/ai/suggest-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
        }),
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.tags)) {
        throw new Error(data.error || "Failed to get suggestions.");
      }
      // Only show tags not already accepted
      setSuggestedTags(
        data.tags.filter((t: string) => !formData.tags.includes(t))
      );
    } catch {
      setTagError("Could not suggest tags. Please try again.");
    } finally {
      setIsSuggestingTags(false);
    }
  }

  function acceptSuggestedTag(tag: string) {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags : [...prev.tags, tag],
    }));
    setSuggestedTags((prev) => prev.filter((t) => t !== tag));
  }

  function dismissSuggestedTag(tag: string) {
    setSuggestedTags((prev) => prev.filter((t) => t !== tag));
  }

  function removeAcceptedTag(tag: string) {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Endpoint TBD — placeholder POST
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      onClose();
    } catch {
      // silently fail for now
    } finally {
      setIsSubmitting(false);
    }
  }

  const categories = ["Social", "Training", "Fetch", "Hiking", "Swimming"];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white md:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8DDD0] px-5 py-4">
          <span className="text-base font-bold text-[#3D2C2C]">
            Create Event
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[#A89279] text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#3D2C2C]">
              Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event title"
              required
              className="rounded-lg border-2 border-[#E5E7EB] px-3.5 py-3 text-[#1A1A2E] outline-none focus:border-[#E8734A]"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#3D2C2C]">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event..."
              rows={3}
              className="rounded-lg border-2 border-[#E5E7EB] px-3.5 py-3 text-[#1A1A2E] outline-none focus:border-[#E8734A] resize-none"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#3D2C2C]">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, category: cat }))
                  }
                  className={`rounded-full border px-4 py-1.5 text-sm ${
                    formData.category === cat
                      ? "border-[#E8734A] bg-[#FFF1E8] text-[#E8734A]"
                      : "border-[#E8DDD0] bg-white text-[#3D2C2C]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#3D2C2C]">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="rounded-lg border-2 border-[#E5E7EB] px-3 py-3 text-[#1A1A2E] outline-none focus:border-[#E8734A]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#3D2C2C]">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="rounded-lg border-2 border-[#E5E7EB] px-3 py-3 text-[#1A1A2E] outline-none focus:border-[#E8734A]"
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#3D2C2C]">
              Location
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Central Park, NYC"
              className="rounded-lg border-2 border-[#E5E7EB] px-3.5 py-3 text-[#1A1A2E] outline-none focus:border-[#E8734A]"
            />
          </div>

          {/* Tags section */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#3D2C2C]">Tags</label>

            {/* Accepted tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full border-2 border-[#E8734A] bg-[#FFF1E8] px-3 py-1 text-sm text-[#E8734A]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeAcceptedTag(tag)}
                      className="leading-none text-[#E8734A] hover:text-[#c0522a]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* AI Suggest button */}
            <button
              type="button"
              onClick={handleSuggestTags}
              disabled={!canSuggestTags || isSuggestingTags}
              className={`w-full rounded-lg border-2 py-3 px-3.5 font-semibold transition ${
                !canSuggestTags || isSuggestingTags
                  ? "cursor-not-allowed border-[#D6C7B8] bg-[#F6F1EA] text-[#A79B90]"
                  : "cursor-pointer border-[#E8734A] bg-gradient-to-r from-[#FFD8C2] to-[#FFF1E8] text-[#E8734A]"
              }`}
            >
              {isSuggestingTags ? "Suggesting..." : "✨ Suggest Tags with AI"}
            </button>

            {tagError && (
              <p className="text-sm text-red-600">{tagError}</p>
            )}

            {/* Suggested tag chips */}
            {suggestedTags.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[#A89279]">
                  Click a tag to add it, or × to dismiss:
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 rounded-full border border-[#E8DDD0] bg-white px-3 py-1 text-sm text-[#3D2C2C]"
                    >
                      <button
                        type="button"
                        onClick={() => acceptSuggestedTag(tag)}
                        className="hover:text-[#E8734A]"
                      >
                        {tag}
                      </button>
                      <button
                        type="button"
                        onClick={() => dismissSuggestedTag(tag)}
                        className="leading-none text-[#A89279] hover:text-[#3D2C2C]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg border border-[#E8734A] bg-gradient-to-br from-[#FF6B6B] to-[#FF8C42] py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}

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
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  return (
    <>
      <main className="min-h-screen bg-[#FDF6EE] p-8">
        <div className="flex items-center justify-between">
          <div className="text-[#3D2C2C] text-2xl font-bold">Events</div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-full bg-[#E8734A] px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            + Create
          </button>
        </div>
        <div className="text-[#A89279] mb-[20px]">
          {filteredEvents.length} paw-some event
          {filteredEvents.length !== 1 ? "s" : ""} nearby
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto">
          {pills.map((pill, index) => (
            <button
              key={index}
              onClick={() => setActive(pill)}
              className={`px-4 py-2 rounded-full border text-sm ${
                active === pill
                  ? "bg-[#E8734A] text-white border-[#E8734A]"
                  : "bg-white text-[#3D2C2C] border-[#E8DDD0]"
              }`}
            >
              {pill}
            </button>
          ))}
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
                <div className="text-[12px] text-[#A89279]">🕐 {event.time}</div>
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

      {showCreateModal && (
        <CreateEventModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}
