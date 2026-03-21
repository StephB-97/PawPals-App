type PetCardProps = {
    name: string;
    breed: string;
    species: "dog" | "cat";
  };
  
  function PetCard({ name, breed, species }: PetCardProps) {

    const isDog = species === "dog";

    const bgColor = isDog ? "bg-[#FFF3B0]" : "bg-[#FFE4CC]";
    const emoji = isDog ? "🐕" : "🐱";
  
    return (
      <div className="w-48 rounded-2xl border border-[#E8DDD0] bg-white">
        {/* Placeholder field for pet Photo */}
        <div className={`flex items-center justify-center h-28 ${bgColor}`}>
            <span className="text-3xl">{emoji}</span>
        </div>
        {/* text content */}
        <div className="p-3" >
            <h1 className="text-sm font-semibold text-[#1A1A2E]" >{name}</h1>
            <h2 className="text-xs text-gray-500">{breed}</h2>
        </div>
      </div>
    );
  }
  
  export default PetCard;