import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import {
  sendHostelConfirmationWhatsApp,
  sendAuditoriumConfirmationWhatsApp,
} from '@/lib/whatsapp-api'
import { safeParseDate } from '@/lib/booking-utils'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await getPayload({ config })
    const bookingId = params.id

    // Try to find in hostel bookings first
    try {
      const hostelBooking = await payload.findByID({
        collection: 'hostel-bookings',
        id: bookingId,
      })

      if (hostelBooking) {
        // Convert PayloadCMS doc to form data format for hostel
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
            checkInDate: safeParseDate(hostelBooking.stayDuration.checkInDate),
            checkOutDate: safeParseDate(hostelBooking.stayDuration.checkOutDate),
          },
          contactInfo: {
            whatsappNumber: hostelBooking.contactInfo.whatsappNumber,
            phoneNumber: hostelBooking.contactInfo.phoneNumber,
          },
          couponCode: hostelBooking.couponCode || '',
          airportPickup: hostelBooking.airportPickup || 'none',
          departureDateTime: hostelBooking.departureDateTime
            ? {
                ...hostelBooking.departureDateTime,
                departureDate: hostelBooking.departureDateTime.departureDate
                  ? safeParseDate(hostelBooking.departureDateTime.departureDate)
                  : undefined,
              }
            : {},
          mealOptions: {
            breakfastOption: hostelBooking.mealOptions?.breakfastOption || 'none',
            lunchOption: hostelBooking.mealOptions?.lunchOption || 'none',
            dinnerOption: hostelBooking.mealOptions?.dinnerOption || 'none',
            breakfastPortions: hostelBooking.mealOptions?.breakfastPortions || 0,
            lunchPortions: hostelBooking.mealOptions?.lunchPortions || 0,
            dinnerPortions: hostelBooking.mealOptions?.dinnerPortions || 0,
            breakfastFrequency: hostelBooking.mealOptions?.breakfastFrequency,
            lunchFrequency: hostelBooking.mealOptions?.lunchFrequency,
            dinnerFrequency: hostelBooking.mealOptions?.dinnerFrequency,
          },
          acceptTerms: hostelBooking.acceptTerms || false,
        }

        // Send WhatsApp confirmation
        const result = await sendHostelConfirmationWhatsApp(bookingData, bookingId)

        return NextResponse.json({
          success: result.success,
          messageId: result.messageId,
          error: result.error,
          type: 'hostel',
        })
      }
    } catch (_error) {
      // Hostel booking not found, continue to auditorium
    }

    // Try to find in auditorium bookings
    try {
      const auditoriumBooking = await payload.findByID({
        collection: 'auditorium-bookings',
        id: bookingId,
      })

      if (auditoriumBooking) {
        // Convert PayloadCMS doc to form data format for auditorium
        const bookingData = {
          fullName: auditoriumBooking.fullName,
          countryOfOrigin: auditoriumBooking.countryOfOrigin,
          eventDetails: {
            eventName: auditoriumBooking.eventDetails.eventName,
            eventDate: safeParseDate(auditoriumBooking.eventDetails.eventDate),
            eventTime: auditoriumBooking.eventDetails.eventTime,
            eventEndTime: auditoriumBooking.eventDetails.eventEndTime,
          },
          contactInfo: {
            egyptPhoneNumber: auditoriumBooking.contactInfo.egyptPhoneNumber,
            whatsappNumber: auditoriumBooking.contactInfo.whatsappNumber,
          },
          excludeServices: {
            airConditioner: auditoriumBooking.excludeServices?.airConditioner || 'none',
            extraChairs: auditoriumBooking.excludeServices?.extraChairs || 'none',
            projector: auditoriumBooking.excludeServices?.projector || 'none',
            extraTables: auditoriumBooking.excludeServices?.extraTables || 'none',
            plates: auditoriumBooking.excludeServices?.plates || 'none',
            glasses: auditoriumBooking.excludeServices?.glasses || 'none',
          },
          couponCode: auditoriumBooking.couponCode || '',
          eventNotes: auditoriumBooking.eventNotes || '',
          acceptTerms: auditoriumBooking.acceptTerms || false,
        }

        // Send WhatsApp confirmation
        const result = await sendAuditoriumConfirmationWhatsApp(bookingData, bookingId)

        return NextResponse.json({
          success: result.success,
          messageId: result.messageId,
          error: result.error,
          type: 'auditorium',
        })
      }
    } catch (_error) {
      // Auditorium booking not found
    }

    // Neither booking found
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  } catch (error) {
    console.error('Error re-sending WhatsApp confirmation:', error)
    return NextResponse.json({ error: 'Failed to send confirmation' }, { status: 500 })
  }
}
