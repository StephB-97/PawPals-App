export default function EventsPage() {
  const pills = [
    "All Events",
    "🎉 Social",
    "🎓 Training",
    "🎾 Fetch",
    "🥾 Hiking",
    "🏊 Swimming",
  ];
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
                className="px-4 py-2 rounded-full border border-[#E8DDD0] bg-white text-sm"
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
