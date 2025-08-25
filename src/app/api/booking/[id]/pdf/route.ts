import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import {
  generateHostelBookingPDFBuffer,
  generateAuditoriumBookingPDFBuffer,
} from '@/lib/pdf-server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await getPayload({ config })
    const bookingId = params.id

    // Get booking type from query parameter for conflict resolution
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'hostel' or 'auditorium'

    let hostelBooking = null
    let auditoriumBooking = null

    // Search in both collections
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

    // If both exist and no type specified, return error asking for type
    if (hostelBooking && auditoriumBooking && !type) {
      return NextResponse.json(
        {
          error:
            'Multiple bookings found. Please specify type parameter: ?type=hostel or ?type=auditorium',
          conflict: true,
        },
        { status: 400 },
      )
    }

    // Handle hostel booking
    if ((type === 'hostel' && hostelBooking) || (hostelBooking && !auditoriumBooking)) {
      const bookingData = {
        fullName: hostelBooking.fullName,
        countryOfOrigin: hostelBooking.countryOfOrigin,
        passportNumber: hostelBooking.passportNumber,
        roomSelection: {
          singleBed: hostelBooking.roomSelection?.singleBed || 0,
          doubleBed: hostelBooking.roomSelection?.doubleBed || 0,
          extraBed: hostelBooking.roomSelection?.extraBed || 0,
        },
        guestDetails: {
          adults: hostelBooking.guestDetails?.adults || 1,
          children: hostelBooking.guestDetails?.children || 0,
        },
        stayDuration: {
          checkInDate: (() => {
            try {
              const dateValue = hostelBooking.stayDuration.checkInDate
              if (!dateValue) return new Date()

              if (dateValue instanceof Date) return dateValue

              if (typeof dateValue === 'string') {
                if (dateValue.includes('T')) {
                  return new Date(dateValue)
                }
                return new Date(dateValue + 'T00:00:00.000Z')
              }

              return new Date(dateValue)
            } catch (error) {
              console.error('Check-in date parsing error:', error)
              return new Date()
            }
          })(),
          checkOutDate: (() => {
            try {
              const dateValue = hostelBooking.stayDuration.checkOutDate
              if (!dateValue) return new Date()

              if (dateValue instanceof Date) return dateValue

              if (typeof dateValue === 'string') {
                if (dateValue.includes('T')) {
                  return new Date(dateValue)
                }
                return new Date(dateValue + 'T00:00:00.000Z')
              }

              return new Date(dateValue)
            } catch (error) {
              console.error('Check-out date parsing error:', error)
              return new Date()
            }
          })(),
        },
        contactInfo: {
          whatsappNumber: hostelBooking.contactInfo.whatsappNumber,
          phoneNumber: hostelBooking.contactInfo.phoneNumber,
        },
        couponCode: hostelBooking.couponCode || '',
        airportPickup: hostelBooking.airportPickup || 'none',
        departureDateTime: hostelBooking.departureDateTime || {},
        mealOptions: hostelBooking.mealOptions || {},
        acceptTerms: hostelBooking.acceptTerms || false,
      }

      const pdfBuffer = await generateHostelBookingPDFBuffer(bookingData, bookingId)

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="hostel_booking_${bookingId}.pdf"`,
        },
      })
    }

    // Handle auditorium booking
    if ((type === 'auditorium' && auditoriumBooking) || (auditoriumBooking && !hostelBooking)) {
      const bookingData = {
        fullName: auditoriumBooking.fullName,
        countryOfOrigin: auditoriumBooking.countryOfOrigin,
        eventDetails: {
          eventName: auditoriumBooking.eventDetails.eventName,
          eventDate: (() => {
            try {
              const dateValue = auditoriumBooking.eventDetails.eventDate
              if (!dateValue) return new Date()

              if (dateValue instanceof Date) return dateValue

              if (typeof dateValue === 'string') {
                if (dateValue.includes('T')) {
                  return new Date(dateValue)
                }
                return new Date(dateValue + 'T00:00:00.000Z')
              }

              return new Date(dateValue)
            } catch (error) {
              console.error('Event date parsing error:', error)
              return new Date()
            }
          })(),
          eventTime: auditoriumBooking.eventDetails.eventTime,
          eventEndTime: auditoriumBooking.eventDetails.eventEndTime,
        },
        contactInfo: {
          egyptPhoneNumber: auditoriumBooking.contactInfo.egyptPhoneNumber,
          whatsappNumber: auditoriumBooking.contactInfo.whatsappNumber,
        },
        excludeServices: auditoriumBooking.excludeServices || {
          airConditioner: 'none',
          extraChairs: 'none',
          projector: 'none',
          extraTables: 'none',
          plates: 'none',
          glasses: 'none',
        },
        couponCode: auditoriumBooking.couponCode || '',
        eventNotes: auditoriumBooking.eventNotes || '',
        acceptTerms: auditoriumBooking.acceptTerms || false,
      }

      const pdfBuffer = await generateAuditoriumBookingPDFBuffer(bookingData, bookingId)

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="auditorium_booking_${bookingId}.pdf"`,
        },
      })
    }

    // Neither booking found
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
