'use client'

import { useState } from 'react'

export default function RSVPButton({ eventId }: { eventId: string }) {
  const [isGoing, setIsGoing] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRSVP() {
    setLoading(true)
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('RSVP failed')
      setIsGoing((prev) => !prev)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleRSVP}
      disabled={loading}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
        isGoing
          ? 'bg-[#FF6B6B] text-white'
          : 'border border-[#FF6B6B] bg-white text-[#FF6B6B]'
      }`}
    >
      {loading ? '...' : isGoing ? 'Going ✓' : 'RSVP'}
    </button>
  )
}