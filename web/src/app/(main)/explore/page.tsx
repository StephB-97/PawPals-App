import dynamic from "next/dynamic";

const ExploreMapView = dynamic(
  () => import("@/components/discover/ExploreMapView"),
  { ssr: false }
);

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-[#FAF6F1] p-4 md:p-6">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold text-[#2E2925]">Explore</h1>
          <p className="text-sm text-[#6B655F]">
            Find nearby pets on the map and tap markers to preview profiles.
          </p>
        </header>
        <ExploreMapView />
      </div>
    </div>
  );
}
