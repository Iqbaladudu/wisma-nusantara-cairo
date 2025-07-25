import { HostelBookingFormData, AuditoriumBookingFormData } from './schemas'
import {
  generateHostelBookingPDFBlobServer,
  generateAuditoriumBookingPDFBlobServer,
} from './pdf-server'

// WhatsApp API configuration
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || ''
const WHATSAPP_API_USER = process.env.WHATSAPP_API_USER || ''
const WHATSAPP_API_PASSWORD = process.env.WHATSAPP_API_PASSWORD || ''

// Validate WhatsApp API configuration
function validateWhatsAppConfig(): void {
  if (!WHATSAPP_API_URL) {
    throw new WhatsAppAPIError('WHATSAPP_API_URL environment variable is not set')
  }
  if (!WHATSAPP_API_USER) {
    throw new WhatsAppAPIError('WHATSAPP_API_USER environment variable is not set')
  }
  if (!WHATSAPP_API_PASSWORD) {
    throw new WhatsAppAPIError('WHATSAPP_API_PASSWORD environment variable is not set')
  }

  // Validate URL format
  try {
    new URL(WHATSAPP_API_URL)
  } catch (error) {
    throw new WhatsAppAPIError(`Invalid WHATSAPP_API_URL format: ${WHATSAPP_API_URL}`)
  }
}

// Error types
export class WhatsAppAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any,
  ) {
    super(message)
    this.name = 'WhatsAppAPIError'
  }
}

// WhatsApp message templates
export const WHATSAPP_TEMPLATES = {
  HOSTEL_CONFIRMATION: {
    text: (bookingData: HostelBookingFormData, bookingId?: string) =>
      `
🏨 *Konfirmasi Booking Hostel - Wisma Nusantara*

Halo ${bookingData.fullName}! 👋

Terima kasih telah melakukan booking hostel. Berikut detail booking Anda:

📋 *Detail Booking:*
• ID Booking: ${bookingId || 'Menunggu konfirmasi'}
• Nama: ${bookingData.fullName}
• Negara: ${bookingData.countryOfOrigin}
• Check-in: ${bookingData.stayDuration.checkInDate.toLocaleDateString('id-ID')}
• Check-out: ${bookingData.stayDuration.checkOutDate.toLocaleDateString('id-ID')}

🛏️ *Kamar:*
${bookingData.roomSelection?.singleBed ? `• Single Bed: ${bookingData.roomSelection.singleBed} kamar` : ''}
${bookingData.roomSelection?.doubleBed ? `• Double Bed: ${bookingData.roomSelection.doubleBed} kamar` : ''}
${bookingData.roomSelection?.extraBed ? `• Extra Bed: ${bookingData.roomSelection.extraBed} bed` : ''}

📞 *Kontak:*
• WhatsApp: ${bookingData.contactInfo.whatsappNumber}
• Telepon: ${bookingData.contactInfo.phoneNumber}

📄 File konfirmasi PDF terlampir di pesan ini.

✅ *Status:* Menunggu konfirmasi pembayaran
💰 Tim kami akan menghubungi Anda dalam 24 jam untuk proses pembayaran.

Terima kasih! 🙏
*Tim Wisma Nusantara*
    `.trim(),
  },

  AUDITORIUM_CONFIRMATION: {
    text: (bookingData: AuditoriumBookingFormData, bookingId?: string) =>
      `
🎭 *Konfirmasi Booking Auditorium - Wisma Nusantara*

Halo ${bookingData.fullName}! 👋

Terima kasih telah melakukan booking auditorium. Berikut detail booking Anda:

📋 *Detail Booking:*
• ID Booking: ${bookingId || 'Menunggu konfirmasi'}
• Nama: ${bookingData.fullName}
• Negara: ${bookingData.countryOfOrigin}

🎪 *Detail Event:*
• Nama Event: ${bookingData.eventDetails.eventName}
• Tanggal: ${bookingData.eventDetails.eventDate.toLocaleDateString('id-ID')}
• Waktu: ${bookingData.eventDetails.eventTime}

📞 *Kontak:*
• Telepon Egypt: ${bookingData.contactInfo.egyptPhoneNumber}
• WhatsApp: ${bookingData.contactInfo.whatsappNumber}

${bookingData.eventNotes ? `📝 *Catatan:* ${bookingData.eventNotes}` : ''}

📄 File konfirmasi PDF terlampir di pesan ini.

✅ *Status:* Menunggu konfirmasi ketersediaan
📞 Tim kami akan menghubungi Anda dalam 24 jam untuk konfirmasi.

Terima kasih! 🙏
*Tim Wisma Nusantara*
    `.trim(),
  },
}

/**
 * Send WhatsApp message with PDF attachment
 */
export async function sendWhatsAppWithPDF(
  phoneNumber: string,
  message: string,
  pdfBlob: Blob,
  filename: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Validate WhatsApp API configuration
    validateWhatsAppConfig()

    // Validate inputs
    if (!phoneNumber || !message || !pdfBlob) {
      throw new WhatsAppAPIError('Missing required parameters')
    }

    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, '')

    // Ensure phone number starts with +
    const formattedPhoneNumber = cleanPhoneNumber.startsWith('+')
      ? cleanPhoneNumber
      : `+${cleanPhoneNumber}`

    // Prepare WhatsApp API request
    const basicAuth = 'Basic ' + btoa(`${WHATSAPP_API_USER}:${WHATSAPP_API_PASSWORD}`)

    const formData = new FormData()
    formData.append('phone', `${formattedPhoneNumber}@s.whatsapp.net`)
    formData.append('caption', message)
    formData.append('file', pdfBlob, filename)
    formData.append('is_forwarded', 'false')

    // Send to WhatsApp API
    const response = await fetch(`${WHATSAPP_API_URL}/send/file`, {
      method: 'POST',
      headers: {
        Authorization: basicAuth,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new WhatsAppAPIError(
        `WhatsApp API error: ${response.status}`,
        response.status,
        errorData,
      )
    }

    const result = await response.json()

    return {
      success: true,
      messageId: result.id || result.messageId,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Send hostel booking confirmation via WhatsApp
 */
export async function sendHostelConfirmationWhatsApp(
  bookingData: HostelBookingFormData,
  bookingId?: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Generate PDF using server-side function
    const pdfBlob = await generateHostelBookingPDFBlobServer(bookingData, bookingId)

    // Generate filename
    const checkInDate = bookingData.stayDuration.checkInDate.toISOString().split('T')[0]
    const guestName = bookingData.fullName.replace(/\s+/g, '_').toLowerCase()
    const filename = `hostel_booking_${guestName}_${checkInDate}_${bookingId || 'confirmation'}.pdf`

    // Generate message
    const message = WHATSAPP_TEMPLATES.HOSTEL_CONFIRMATION.text(bookingData, bookingId)

    // Send via WhatsApp
    return await sendWhatsAppWithPDF(
      bookingData.contactInfo.whatsappNumber,
      message,
      pdfBlob,
      filename,
    )
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send confirmation',
    }
  }
}

/**
 * Send auditorium booking confirmation via WhatsApp
 */
export async function sendAuditoriumConfirmationWhatsApp(
  bookingData: AuditoriumBookingFormData,
  bookingId?: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Generate PDF using server-side function
    const pdfBlob = await generateAuditoriumBookingPDFBlobServer(bookingData, bookingId)

    // Generate filename
    const eventDate = bookingData.eventDetails.eventDate.toISOString().split('T')[0]
    const eventName = bookingData.eventDetails.eventName.replace(/\s+/g, '_').toLowerCase()
    const filename = `auditorium_booking_${eventName}_${eventDate}_${bookingId || 'confirmation'}.pdf`

    // Generate message
    const message = WHATSAPP_TEMPLATES.AUDITORIUM_CONFIRMATION.text(bookingData, bookingId)

    // Send via WhatsApp
    return await sendWhatsAppWithPDF(
      bookingData.contactInfo.whatsappNumber,
      message,
      pdfBlob,
      filename,
    )
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send confirmation',
    }
  }
}

/**
 * Send simple WhatsApp text message
 */
export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Validate WhatsApp API configuration
    validateWhatsAppConfig()

    const cleanPhoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, '')
    const formattedPhoneNumber = cleanPhoneNumber.startsWith('+')
      ? cleanPhoneNumber
      : `+${cleanPhoneNumber}`

    const basicAuth = 'Basic ' + btoa(`${WHATSAPP_API_USER}:${WHATSAPP_API_PASSWORD}`)

    const formData = new FormData()
    formData.append('phone', `${formattedPhoneNumber}@s.whatsapp.net`)
    formData.append('message', message)
    formData.append('is_forwarded', 'false')

    const response = await fetch(`${WHATSAPP_API_URL}/send/message`, {
      method: 'POST',
      headers: {
        Authorization: basicAuth,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new WhatsAppAPIError(
        `WhatsApp API error: ${response.status}`,
        response.status,
        errorData,
      )
    }

    const result = await response.json()

    return {
      success: true,
      messageId: result.id || result.messageId,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    }
  }
}
