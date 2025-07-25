import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Booking Auditorium - Wisma Nusantara Cairo',
  description: 'Book auditorium facilities at Wisma Nusantara Cairo for your events, seminars, and conferences.',
}

export default function AuditoriumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
