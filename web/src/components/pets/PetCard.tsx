type PetCardProps = {
  name: string;
  breed: string;
  species: 'dog' | 'cat';
};

export default function PetCard({ name, breed, species }: PetCardProps) {
  const emoji = species === 'dog' ? '🐕' : '🐱';

  return (
    <div className="rounded-2xl border border-[#E8DDD0] bg-white p-4 shadow-sm">
      <div className="flex h-32 items-center justify-center rounded-xl bg-[#FFF1E8] text-5xl">
        {emoji}
      </div>
      <div className="mt-3">
        <h3 className="text-lg font-semibold text-[#3D2C2C]">{name}</h3>
        <p className="text-sm text-[#8B7355]">{breed || species}</p>
      </div>
    </div>
  );
}