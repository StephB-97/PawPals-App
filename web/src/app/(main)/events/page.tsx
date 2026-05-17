import Link from 'next/link';

export default function EventsPage() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link
          href="/events/create"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Create event
        </Link>
      </div>
      <p className="text-gray-600">Browse upcoming community events — more coming soon.</p>
    </div>
  );
}
