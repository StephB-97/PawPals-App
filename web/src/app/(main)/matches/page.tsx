export default function MatchesPage() {
  return (
    <>
      <div className = "min-h-screen bg-[#FDF6EE] p-8">
        <div className = "text-[#3D2C2C] text-2xl font-bold">Matches</div>
        <div className = "text-[#A89279] mb-[20px]" >3 paws matched · 1 new</div>
        {/* Search bar */}
        <div className = "relative">
          <span className="absolute left-[14px] top-1/2 -translate-y-1/2">🔍</span>
          <input 
            type="text"
            placeholder="Search matches..." 
            className="bg-[#F0EBE3] text-[grey] w-full pt-[12px] pr-[14px] pb-[12px] pl-[40px] rounded-lg "
          />
        </div>
      </div>
    </>
  );
}
