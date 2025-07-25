'use client'

import { pdf } from '@react-pdf/renderer'
import { HostelBookingPDF } from '@/components/pdf/hostel-booking-pdf'
import { AuditoriumBookingPDF } from '@/components/pdf/auditorium-booking-pdf'
import { HostelBookingFormData, AuditoriumBookingFormData } from '@/lib/schemas'

/**
 * Generate and download PDF for hostel booking
 */
export async function downloadHostelBookingPDF(
  bookingData: HostelBookingFormData,
  bookingId?: string,
): Promise<void> {
  try {
    // Generate PDF blob using the shared function
    const blob = await generateHostelBookingPDFBlob(bookingData, bookingId)

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    // Generate filename with booking details
    const checkInDate = bookingData.stayDuration.checkInDate.toISOString().split('T')[0]
    const guestName = bookingData.fullName.replace(/\s+/g, '_').toLowerCase()
    const filename = `hostel_booking_${guestName}_${checkInDate}_${bookingId || 'confirmation'}.pdf`

    link.download = filename

    // Add to DOM temporarily for download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Cleanup
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download error:', error)
    throw new Error(
      `Gagal membuat PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Generate and download PDF for auditorium booking
 */
export async function downloadAuditoriumBookingPDF(
  bookingData: AuditoriumBookingFormData,
  bookingId?: string,
): Promise<void> {
  try {
    // Create PDF document
    const doc = AuditoriumBookingPDF({ bookingData, bookingId })

    // Generate PDF blob
    const blob = await pdf(doc).toBlob()

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    // Generate filename with booking details
    const eventDate = bookingData.eventDetails.eventDate.toISOString().split('T')[0]
    const eventName = bookingData.eventDetails.eventName.replace(/\s+/g, '_').toLowerCase()
    const filename = `auditorium_booking_${eventName}_${eventDate}_${bookingId || 'confirmation'}.pdf`

    link.download = filename

    // Add to DOM temporarily for download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Cleanup
    URL.revokeObjectURL(url)
  } catch (error) {
    throw new Error('Gagal membuat PDF. Silakan coba lagi.')
  }
}

/**
 * Generate PDF blob for hostel booking (for preview or server-side usage)
 */
export async function generateHostelBookingPDFBlob(
  bookingData: HostelBookingFormData,
  bookingId?: string,
): Promise<Blob> {
  try {
    const doc = HostelBookingPDF({ bookingData, bookingId })
    const blob = await pdf(doc).toBlob()
    return blob
  } catch (error) {
    console.error('PDF generation error:', error)
    throw new Error(
      `Gagal membuat PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Generate PDF blob for auditorium booking (for preview or server-side usage)
 */
export async function generateAuditoriumBookingPDFBlob(
  bookingData: AuditoriumBookingFormData,
  bookingId?: string,
): Promise<Blob> {
  try {
    const doc = AuditoriumBookingPDF({ bookingData, bookingId })
    return await pdf(doc).toBlob()
  } catch (error) {
    throw new Error('Gagal membuat PDF.')
  }
}

/**
 * Open PDF in new tab for preview
 */
export async function previewHostelBookingPDF(
  bookingData: HostelBookingFormData,
  bookingId?: string,
): Promise<void> {
  try {
    const blob = await generateHostelBookingPDFBlob(bookingData, bookingId)
    const url = URL.createObjectURL(blob)

    // Open in new tab
    const newWindow = window.open(url, '_blank')
    if (!newWindow) {
      throw new Error('Popup diblokir. Silakan izinkan popup untuk situs ini.')
    }

    // Cleanup after a delay to allow the PDF to load
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)
  } catch (error) {
    console.error('Preview error:', error)
    throw new Error(
      `Gagal membuka preview PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

/**
 * Open PDF in new tab for preview
 */
export async function previewAuditoriumBookingPDF(
  bookingData: AuditoriumBookingFormData,
  bookingId?: string,
): Promise<void> {
  try {
    const blob = await generateAuditoriumBookingPDFBlob(bookingData, bookingId)
    const url = URL.createObjectURL(blob)

    // Open in new tab
    const newWindow = window.open(url, '_blank')
    if (!newWindow) {
      throw new Error('Popup blocked. Please allow popups for this site.')
    }

    // Cleanup after a delay to allow the PDF to load
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)
  } catch (error) {
    throw new Error('Gagal membuka preview PDF.')
  }
}

/**
 * Utility function to format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Check if PDF generation is supported in current browser
 */
export function isPDFGenerationSupported(): boolean {
  try {
    // Check if required APIs are available
    return (
      typeof window !== 'undefined' &&
      typeof URL !== 'undefined' &&
      typeof URL.createObjectURL === 'function' &&
      typeof Blob !== 'undefined'
    )
  } catch {
    return false
  }
}

/**
 * Get estimated PDF file size (rough estimation)
 */
export function getEstimatedPDFSize(bookingType: 'hostel' | 'auditorium'): string {
  // Rough estimates based on content complexity
  const estimates = {
    hostel: 150, // KB
    auditorium: 120, // KB
  }

  return formatFileSize(estimates[bookingType] * 1024)
}

/**
 * Validate booking data before PDF generation
 */
export function validateHostelBookingData(data: HostelBookingFormData): string[] {
  const errors: string[] = []

  if (!data.fullName?.trim()) errors.push('Nama lengkap tidak boleh kosong')
  if (!data.countryOfOrigin?.trim()) errors.push('Asal negara tidak boleh kosong')
  if (!data.passportNumber?.trim()) errors.push('Nomor paspor tidak boleh kosong')
  if (!data.stayDuration?.checkInDate) errors.push('Tanggal check-in tidak valid')
  if (!data.stayDuration?.checkOutDate) errors.push('Tanggal check-out tidak valid')
  if (!data.contactInfo?.whatsappNumber?.trim()) errors.push('Nomor WhatsApp tidak boleh kosong')
  if (!data.contactInfo?.phoneNumber?.trim()) errors.push('Nomor telepon tidak boleh kosong')
  if (!data.acceptTerms) errors.push('Syarat dan ketentuan harus disetujui')

  return errors
}

/**
 * Validate auditorium booking data before PDF generation
 */
export function validateAuditoriumBookingData(data: AuditoriumBookingFormData): string[] {
  const errors: string[] = []

  if (!data.fullName?.trim()) errors.push('Nama lengkap tidak boleh kosong')
  if (!data.countryOfOrigin?.trim()) errors.push('Asal negara tidak boleh kosong')
  if (!data.eventDetails?.eventName?.trim()) errors.push('Nama acara tidak boleh kosong')
  if (!data.eventDetails?.eventDate) errors.push('Tanggal acara tidak valid')
  if (!data.eventDetails?.eventTime?.trim()) errors.push('Waktu acara tidak boleh kosong')
  if (!data.contactInfo?.egyptPhoneNumber?.trim())
    errors.push('Nomor telepon Egypt tidak boleh kosong')
  if (!data.contactInfo?.whatsappNumber?.trim()) errors.push('Nomor WhatsApp tidak boleh kosong')

  return errors
}

/**
 * Generate PDF with error handling and user feedback
 */
export async function generatePDFWithFeedback(
  type: 'hostel' | 'auditorium',
  bookingData: HostelBookingFormData | AuditoriumBookingFormData,
  bookingId?: string,
  onProgress?: (message: string) => void,
): Promise<void> {
  try {
    onProgress?.('Memvalidasi data booking...')

    // Validate data
    const errors =
      type === 'hostel'
        ? validateHostelBookingData(bookingData as HostelBookingFormData)
        : validateAuditoriumBookingData(bookingData as AuditoriumBookingFormData)

    if (errors.length > 0) {
      throw new Error(`Data tidak valid: ${errors.join(', ')}`)
    }

    onProgress?.('Membuat dokumen PDF...')

    // Generate PDF
    if (type === 'hostel') {
      await downloadHostelBookingPDF(bookingData as HostelBookingFormData, bookingId)
    } else {
      await downloadAuditoriumBookingPDF(bookingData as AuditoriumBookingFormData, bookingId)
    }

    onProgress?.('PDF berhasil dibuat dan diunduh!')
  } catch (error) {
    throw error
  }
}
