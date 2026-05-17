'use client'

import { useState } from 'react'

type RSVPButtonProps = {
  eventId: string
  initialGoing?: boolean
}

export default function RSVPButton({
  eventId,
  initialGoing = false,
}: RSVPButtonProps) {
  const [isGoing, setIsGoing] = useState(initialGoing)
  const [loading, setLoading] = useState(false)

  async function handleRSVP() {
    setLoading(true)

    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to RSVP')
      }

      setIsGoing((current) => !current)
    } catch (error) {
      console.error(error)
      alert('Could not update RSVP right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleRSVP}
      disabled={loading}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
        isGoing
          ? 'bg-[#FF6B6B] text-white'
          : 'bg-white text-[#FF6B6B] ring-1 ring-[#FF6B6B]'
      }`}
    >
      {isGoing ? 'Going ✓' : 'RSVP'}
    </button>
  )
}