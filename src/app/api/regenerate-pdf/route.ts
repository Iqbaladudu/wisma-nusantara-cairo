import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import {
  sendAuditoriumConfirmationWhatsApp,
  sendHostelConfirmationWhatsApp,
} from '@/lib/whatsapp-api'
import config from '@/payload.config'

const payload = getPayload({ config })

export async function POST(req: Request) {
  const { bookingId, collectionSlug } = await req.json()

  if (!bookingId) {
    return NextResponse.json({ success: false, error: 'Missing bookingId' }, { status: 400 })
  }

  if (!collectionSlug) {
    return NextResponse.json({ success: false, error: 'Missing collectionSlug' }, { status: 400 })
  }

  // Validate that collectionSlug is one of the expected values
  const validCollections = ['auditorium-bookings', 'hostel-bookings']
  if (!validCollections.includes(collectionSlug)) {
    return NextResponse.json(
      {
        success: false,
        error: `Invalid collectionSlug. Expected one of: ${validCollections.join(', ')}`,
      },
      { status: 400 },
    )
  }

  let doc = null

  try {
    // Get the document from the specified collection
    doc = await (
      await payload
    ).findByID({
      collection: collectionSlug,
      id: bookingId,
    })

    if (!doc) {
      return NextResponse.json(
        { success: false, error: `Booking not found in ${collectionSlug} collection` },
        { status: 404 },
      )
    }

    // Process based on collection type
    let result: { success: boolean; error?: string }

    if (collectionSlug === 'auditorium-bookings') {
      const bookingData = {
        fullName: doc.fullName,
        countryOfOrigin: doc.countryOfOrigin,
        eventDetails: {
          eventName: doc.eventDetails.eventName,
          eventDate: (() => {
            const d = new Date(doc.eventDetails.eventDate)
            d.setDate(d.getDate() + 1)
            return d
          })(),
          eventTime: doc.eventDetails.eventTime,
          eventEndTime: doc.eventDetails.eventEndTime,
        },
        contactInfo: {
          egyptPhoneNumber: doc.contactInfo.egyptPhoneNumber,
          whatsappNumber: doc.contactInfo.whatsappNumber,
        },
        excludeServices: doc.excludeServices,
        couponCode: doc.couponCode,
        eventNotes: doc.eventNotes,
        acceptTerms: doc.acceptTerms,
      }
      result = await sendAuditoriumConfirmationWhatsApp(bookingData, doc.id)
    } else if (collectionSlug === 'hostel-bookings') {
      const bookingData = {
        fullName: doc.fullName,
        countryOfOrigin: doc.countryOfOrigin,
        passportNumber: doc.passportNumber,
        roomSelection: doc.roomSelection,
        guestDetails: doc.guestDetails,
        stayDuration: {
          checkInDate: (() => {
            const d = new Date(doc.stayDuration.checkInDate)
            d.setDate(d.getDate() + 1)
            return d
          })(),
          checkOutDate: (() => {
            const d = new Date(doc.stayDuration.checkOutDate)
            d.setDate(d.getDate() + 1)
            return d
          })(),
        },
        contactInfo: doc.contactInfo,
        couponCode: doc.couponCode,
        airportPickup: doc.airportPickup,
        departureDateTime: doc.departureDateTime,
        mealOptions: doc.mealOptions,
        additionalServices: doc.additionalServices,
        acceptTerms: doc.acceptTerms,
      }
      result = await sendHostelConfirmationWhatsApp(bookingData, doc.id)
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid collection type' },
        { status: 400 },
      )
    }

    if (result.success) {
      return NextResponse.json({ success: true, message: 'WhatsApp confirmation sent.' })
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to send WhatsApp message' },
        { status: 500 },
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 },
    )
  }
}
