import { NextRequest, NextResponse } from 'next/server'
import {
  sendHostelConfirmationWhatsApp,
  sendAuditoriumConfirmationWhatsApp,
} from '@/lib/whatsapp-api'
import { HostelBookingFormData, AuditoriumBookingFormData } from '@/lib/schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, bookingData, bookingId } = body

    // Validate request
    if (!type || !bookingData) {
      return NextResponse.json(
        { error: 'Missing required fields: type and bookingData' },
        { status: 400 },
      )
    }

    if (type !== 'hostel' && type !== 'auditorium') {
      return NextResponse.json(
        { error: 'Invalid type. Must be "hostel" or "auditorium"' },
        { status: 400 },
      )
    }

    // Validate WhatsApp number exists
    const whatsappNumber =
      type === 'hostel'
        ? bookingData.contactInfo?.whatsappNumber
        : bookingData.contactInfo?.whatsappNumber

    if (!whatsappNumber) {
      return NextResponse.json({ error: 'WhatsApp number is required' }, { status: 400 })
    }

    // Send confirmation based on type
    let result
    if (type === 'hostel') {
      result = await sendHostelConfirmationWhatsApp(bookingData as HostelBookingFormData, bookingId)
    } else {
      result = await sendAuditoriumConfirmationWhatsApp(
        bookingData as AuditoriumBookingFormData,
        bookingId,
      )
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: 'Confirmation sent successfully via WhatsApp',
      })
    } else {
      return NextResponse.json(
        {
          error: result.error || 'Failed to send WhatsApp confirmation',
          success: false,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
