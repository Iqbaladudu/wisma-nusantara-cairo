import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = await getPayload({ config })
    const { id: bookingId } = await params

    let hostelBooking = null
    let auditoriumBooking = null

    // Search in both collections simultaneously
    try {
      hostelBooking = await payload.findByID({
        collection: 'hostel-bookings',
        id: bookingId,
      })
    } catch (_error) {
      // Hostel booking not found
    }

    try {
      auditoriumBooking = await payload.findByID({
        collection: 'auditorium-bookings',
        id: bookingId,
      })
    } catch (_error) {
      // Auditorium booking not found
    }

    // If both bookings exist with same ID (rare case)
    if (hostelBooking && auditoriumBooking) {
      return NextResponse.json({
        success: true,
        conflict: true,
        message: 'Multiple bookings found with same ID',
        bookings: [
          { type: 'hostel', booking: hostelBooking },
          { type: 'auditorium', booking: auditoriumBooking },
        ],
      })
    }

    // Single booking found
    if (hostelBooking) {
      return NextResponse.json({
        success: true,
        type: 'hostel',
        booking: hostelBooking,
      })
    }

    if (auditoriumBooking) {
      return NextResponse.json({
        success: true,
        type: 'auditorium',
        booking: auditoriumBooking,
      })
    }

    // Neither booking found
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}
