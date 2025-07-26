import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { HostelBookingFormData, AuditoriumBookingFormData } from './schemas'
import { HostelBookingPDF } from '@/components/pdf/hostel-booking-pdf'
import { AuditoriumBookingPDF } from '../components/pdf/auditorium-booking-pdf'

/**
 * Server-side PDF generation for hostel booking
 * This function can be called from server-side code (API routes, collection hooks)
 */
export async function generateHostelBookingPDFBuffer(
  bookingData: HostelBookingFormData,
  bookingId?: string,
): Promise<Buffer> {
  try {
    // Create PDF document using React PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(HostelBookingPDF, { bookingData, bookingId }) as any,
    )

    return pdfBuffer
  } catch (error) {
    throw new Error('Failed to generate hostel booking PDF')
  }
}

/**
 * Server-side PDF generation for auditorium booking
 * This function can be called from server-side code (API routes, collection hooks)
 */
export async function generateAuditoriumBookingPDFBuffer(
  bookingData: AuditoriumBookingFormData,
  bookingId?: string,
): Promise<Buffer> {
  try {
    // Create PDF document using React PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(AuditoriumBookingPDF, { bookingData, bookingId }) as any,
    )

    return pdfBuffer
  } catch (error) {
    throw new Error('Failed to generate auditorium booking PDF')
  }
}

/**
 * Convert buffer to blob (for client-side compatibility)
 */
export function bufferToBlob(buffer: Buffer, mimeType: string = 'application/pdf'): Blob {
  return new Blob([new Uint8Array(buffer)], { type: mimeType })
}

/**
 * Server-side PDF generation with blob output for hostel booking
 * This creates a blob that can be used with WhatsApp API
 */
export async function generateHostelBookingPDFBlobServer(
  bookingData: HostelBookingFormData,
  bookingId?: string,
): Promise<Blob> {
  const buffer = await generateHostelBookingPDFBuffer(bookingData, bookingId)
  return bufferToBlob(buffer)
}

/**
 * Server-side PDF generation with blob output for auditorium booking
 * This creates a blob that can be used with WhatsApp API:
 */
export async function generateAuditoriumBookingPDFBlobServer(
  bookingData: AuditoriumBookingFormData,
  bookingId?: string,
): Promise<Blob> {
  const buffer = await generateAuditoriumBookingPDFBuffer(bookingData, bookingId)
  return bufferToBlob(buffer)
}
