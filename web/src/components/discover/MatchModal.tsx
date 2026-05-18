'use client'

import { useRouter } from 'next/navigation'

type PetInfo = {
  name: string
  image?: string
}

type MatchModalProps = {
  yourPet: PetInfo
  theirPet: PetInfo
  onClose: () => void
}

export default function MatchModal({ yourPet, theirPet, onClose }: MatchModalProps) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
        {/* Celebration emoji */}
        <div className="text-6xl">🎉</div>

        {/* Title */}
        <h2 className="mt-4 text-3xl font-bold text-[#34D399]">
          It&apos;s a Match!
        </h2>

        {/* Subtitle */}
        <p className="mt-2 text-sm text-[#6B655F]">
          {yourPet.name} and {theirPet.name} want to be friends!
        </p>

        {/* Pet photos side by side */}
        <div className="mt-6 flex items-center justify-center gap-4">
          {/* Your pet */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A854] to-[#B8860B] text-3xl shadow-lg ring-4 ring-[#34D399]">
            {yourPet.image || '🐕'}
          </div>

          {/* Heart */}
          <div className="text-3xl text-[#34D399]">💚</div>

          {/* Their pet */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A854] to-[#B8860B] text-3xl shadow-lg ring-4 ring-[#34D399]">
            {theirPet.image || '🐕'}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push('/matches')}
            className="w-full rounded-xl bg-[#34D399] py-3 font-semibold text-white shadow-md transition hover:bg-[#2bbe89]"
          >
            View Match
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border-2 border-[#34D399] bg-white py-3 font-semibold text-[#34D399] transition hover:bg-[#f0fdf9]"
          >
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  )
}