import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer'
import { AuditoriumBookingFormData } from '@/lib/schemas'
import { calculateAuditoriumPrice, calculateExcludeServicesPrice } from '@/lib/api'

// Use system fonts for better compatibility
Font.register({
  family: 'Plus Jakarta Sans Variable',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/plus-jakarta-sans:vf@latest/latin-wght-normal.woff2',
    },
  ],
})

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: '#10b981',
    paddingBottom: 20,
  },
  logo: {
    width: 56,
    height: 56,
    objectFit: 'contain',
    marginHorizontal: 'auto',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    marginTop: 10,
  },
  bookingId: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 4,
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: '40%',
    fontSize: 10,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  value: {
    width: '60%',
    fontSize: 10,
    color: '#1f2937',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    width: '48%',
  },

  priceSection: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 10,
    color: '#374151',
  },
  priceValue: {
    fontSize: 10,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#d1d5db',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#065f46',
  },
  nextSteps: {
    backgroundColor: '#eff6ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  nextStepsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  nextStepItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bullet: {
    width: 10,
    fontSize: 10,
    color: '#3b82f6',
  },
  nextStepText: {
    flex: 1,
    fontSize: 9,
    color: '#1e40af',
  },
  footer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#e5e7eb',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 4,
  },
  contact: {
    fontSize: 9,
    color: '#3b82f6',
  },
})

interface AuditoriumBookingPDFProps {
  bookingData: AuditoriumBookingFormData
  bookingId?: string
  logoSrc?: string
}

export const AuditoriumBookingPDF = ({
  bookingData,
  bookingId,
  logoSrc,
}: AuditoriumBookingPDFProps) => {
  // Calculate pricing
  const basePricing = calculateAuditoriumPrice(
    bookingData.eventDetails.eventTime,
    bookingData.eventDetails.eventEndTime,
  )

  const excludeServicesPricing = calculateExcludeServicesPrice(bookingData.excludeServices)
  const totalCost = basePricing.totalPrice + excludeServicesPricing.totalPrice

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    if (!(d instanceof Date) || isNaN(d.getTime())) return String(date)

    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()

    return `${day}/${month}/${year}`
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    // Ensure HH:MM format
    const [hours, minutes] = time.split(':')
    return `${hours}:${minutes}`
  }

  console.log('formatDate:', formatTime(bookingData.eventDetails.eventTime))

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
    }).format(amount)
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            src="https://res.cloudinary.com/dumgfj4nh/image/upload/v1754863207/wisma_tnpfsc.png"
            style={styles.logo}
          />
          <Text style={styles.title}>KONFIRMASI BOOKING AUDITORIUM</Text>
          <Text style={styles.subtitle}>Wisma Nusantara Cairo</Text>
          <Text style={styles.subtitle}>
            Booking berhasil untuk acara &quot;{bookingData.eventDetails.eventName}&quot;
          </Text>
          {bookingId && <Text style={styles.bookingId}>Booking ID: {bookingId}</Text>}
        </View>

        {/* Main Content Grid */}
        <View style={styles.grid}>
          {/* Left Column */}
          <View style={styles.gridItem}>
            {/* Event Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detail Acara</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Nama Acara:</Text>
                <Text style={styles.value}>{bookingData.eventDetails.eventName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Tanggal:</Text>
                <Text style={styles.value}>{formatDate(bookingData.eventDetails.eventDate)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Waktu:</Text>
                <Text style={styles.value}>
                  {formatTime(bookingData.eventDetails.eventTime)} -{' '}
                  {formatTime(bookingData.eventDetails.eventEndTime)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Durasi:</Text>
                <Text style={styles.value}>{basePricing.totalHours} Jam</Text>
              </View>
            </View>

            {/* Personal Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informasi Personal</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Nama Lengkap:</Text>
                <Text style={styles.value}>{bookingData.fullName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Asal Negara:</Text>
                <Text style={styles.value}>{bookingData.countryOfOrigin}</Text>
              </View>
            </View>

            {/* Contact Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informasi Kontak</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Telepon Egypt:</Text>
                <Text style={styles.value}>{bookingData.contactInfo.egyptPhoneNumber}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>WhatsApp:</Text>
                <Text style={styles.value}>{bookingData.contactInfo.whatsappNumber}</Text>
              </View>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.gridItem}>
            {/* Additional Services */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Layanan Tambahan</Text>

              {/* Air Conditioner */}
              {bookingData.excludeServices.airConditioner !== 'none' && (
                <View style={styles.row}>
                  <Text style={styles.label}>AC:</Text>
                  <Text style={styles.value}>
                    {bookingData.excludeServices.airConditioner.replace('_', '-')} jam
                  </Text>
                </View>
              )}

              {/* Extra Chairs */}
              {bookingData.excludeServices.extraChairs !== 'none' && (
                <View style={styles.row}>
                  <Text style={styles.label}>Kursi Tambahan:</Text>
                  <Text style={styles.value}>
                    {bookingData.excludeServices.extraChairs.replace('_', ' ')}
                  </Text>
                </View>
              )}

              {/* Projector */}
              {bookingData.excludeServices.projector !== 'none' && (
                <View style={styles.row}>
                  <Text style={styles.label}>Proyektor:</Text>
                  <Text style={styles.value}>
                    {bookingData.excludeServices.projector.replace('_', ' ')}
                  </Text>
                </View>
              )}

              {/* Extra Tables */}
              {bookingData.excludeServices.extraTables !== 'none' && (
                <View style={styles.row}>
                  <Text style={styles.label}>Meja Tambahan:</Text>
                  <Text style={styles.value}>
                    {bookingData.excludeServices.extraTables.replace('_', ' ')}
                  </Text>
                </View>
              )}

              {/* Plates */}
              {bookingData.excludeServices.plates !== 'none' && (
                <View style={styles.row}>
                  <Text style={styles.label}>Piring:</Text>
                  <Text style={styles.value}>
                    {bookingData.excludeServices.plates.replace('_', ' ')}
                  </Text>
                </View>
              )}

              {/* Glasses */}
              {bookingData.excludeServices.glasses !== 'none' && (
                <View style={styles.row}>
                  <Text style={styles.label}>Gelas:</Text>
                  <Text style={styles.value}>
                    {bookingData.excludeServices.glasses.replace('_', ' ')}
                  </Text>
                </View>
              )}

              {/* Show message if no services selected */}
              {Object.values(bookingData.excludeServices).every(
                (service) => service === 'none',
              ) && (
                <View style={styles.row}>
                  <Text style={styles.value}>Tidak ada layanan tambahan dipilih</Text>
                </View>
              )}
            </View>

            {/* Pricing Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ringkasan Biaya</Text>
              <View style={styles.priceSection}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>
                    Biaya Dasar Auditorium ({basePricing.totalHours} jam):
                  </Text>
                  <Text style={styles.priceValue}>{basePricing.totalPrice}</Text>
                </View>
                {excludeServicesPricing.totalPrice > 0 && (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Layanan Tambahan:</Text>
                    <Text style={styles.priceValue}>{excludeServicesPricing.totalPrice} EGP</Text>
                  </View>
                )}
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Paket Harga:</Text>
                </View>
                <View>
                  <Text style={styles.priceValue}>{basePricing.priceBreakdown}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>{totalCost} EGP</Text>
                </View>
              </View>
            </View>

            {/* Additional Information */}
            {(bookingData.couponCode || bookingData.eventNotes) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informasi Tambahan</Text>
                {bookingData.couponCode && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Kode Kupon:</Text>
                    <Text style={styles.value}>{bookingData.couponCode}</Text>
                  </View>
                )}
                {bookingData.eventNotes && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Catatan Acara:</Text>
                    <Text style={styles.value}>{bookingData.eventNotes}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextSteps}>
          <Text style={styles.nextStepsTitle}>Langkah Selanjutnya</Text>
          <View style={styles.nextStepItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.nextStepText}>
              Anda akan menerima konfirmasi booking melalui email dalam 1-5 menit
            </Text>
          </View>
          <View style={styles.nextStepItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.nextStepText}>
              Simpan dokumen ini sebagai referensi booking Anda
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Butuh bantuan? Hubungi customer service kami</Text>
          <Text style={styles.contact}>WhatsApp: +20 1555336481</Text>
          <Text style={styles.footerText}>Wisma Nusantara Cairo - Your Home Away From Home</Text>
        </View>
      </Page>
    </Document>
  )
}

export default AuditoriumBookingPDF
