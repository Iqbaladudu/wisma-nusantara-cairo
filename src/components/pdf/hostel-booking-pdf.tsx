import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer'
import { HostelBookingFormData } from '@/lib/schemas'
import { calculateBookingPrice } from '@/lib/api'

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

interface HostelBookingPDFProps {
  bookingData: HostelBookingFormData
  bookingId?: string
  logoSrc?: string
}

export function HostelBookingPDF({ bookingData, bookingId, logoSrc }: HostelBookingPDFProps) {
  const pricing = calculateBookingPrice(bookingData)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
          <Text style={styles.title}>KONFIRMASI BOOKING HOSTEL</Text>
          <Text style={styles.subtitle}>Wisma Nusantara Cairo</Text>
          <Text style={styles.subtitle}>Booking berhasil untuk {bookingData.fullName}</Text>
          {bookingId && <Text style={styles.bookingId}>Booking ID: {bookingId}</Text>}
        </View>

        {/* Main Content Grid */}
        <View style={styles.grid}>
          {/* Left Column */}
          <View style={styles.gridItem}>
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
              <View style={styles.row}>
                <Text style={styles.label}>Nomor Paspor:</Text>
                <Text style={styles.value}>{bookingData.passportNumber}</Text>
              </View>
            </View>

            {/* Room Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pilihan Kamar</Text>
              {bookingData.roomSelection.singleBed > 0 && (
                <View style={styles.row}>
                  <Text style={styles.label}>Single Bed Room:</Text>
                  <Text style={styles.value}>{bookingData.roomSelection.singleBed} kamar</Text>
                </View>
              )}
              {bookingData.roomSelection.doubleBed > 0 && (
                <View style={styles.row}>
                  <Text style={styles.label}>Double Bed Room:</Text>
                  <Text style={styles.value}>{bookingData.roomSelection.doubleBed} kamar</Text>
                </View>
              )}
              {bookingData.roomSelection.extraBed > 0 && (
                <View style={styles.row}>
                  <Text style={styles.label}>Extra Bed:</Text>
                  <Text style={styles.value}>{bookingData.roomSelection.extraBed} tempat</Text>
                </View>
              )}
              <View style={styles.row}>
                <Text style={styles.label}>Total Tamu:</Text>
                <Text style={styles.value}>
                  {bookingData.guestDetails.adults} dewasa, {bookingData.guestDetails.children} anak
                </Text>
              </View>
            </View>

            {/* Stay Duration */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Durasi Menginap</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Check-in:</Text>
                <Text style={styles.value}>{formatDate(bookingData.stayDuration.checkInDate)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Check-out:</Text>
                <Text style={styles.value}>
                  {formatDate(bookingData.stayDuration.checkOutDate)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Lama Menginap:</Text>
                <Text style={styles.value}>{pricing.breakdown.nights} malam</Text>
              </View>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.gridItem}>
            {/* Contact Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informasi Kontak</Text>
              <View style={styles.row}>
                <Text style={styles.label}>WhatsApp:</Text>
                <Text style={styles.value}>{bookingData.contactInfo.whatsappNumber}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Telepon:</Text>
                <Text style={styles.value}>{bookingData.contactInfo.phoneNumber}</Text>
              </View>
            </View>

            {/* Additional Services */}
            {(bookingData.airportPickup !== 'none' || bookingData.couponCode) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Layanan Tambahan</Text>
                {bookingData.airportPickup !== 'none' && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Airport Pickup:</Text>
                    <Text style={styles.value}>
                      {bookingData.airportPickup === 'medium_vehicle' ? 'Medium Vehicle' : 'Hiace'}
                    </Text>
                  </View>
                )}
                {bookingData.couponCode && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Kode Kupon:</Text>
                    <Text style={styles.value}>{bookingData.couponCode}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Pricing Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ringkasan Biaya</Text>
              <View style={styles.priceSection}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>
                    Biaya Kamar ({pricing.breakdown.nights} malam):
                  </Text>
                  <Text style={styles.priceValue}>{formatCurrency(pricing.roomCost)}</Text>
                </View>
                {pricing.additionalServicesCost > 0 && (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Layanan Tambahan:</Text>
                    <Text style={styles.priceValue}>
                      {formatCurrency(pricing.additionalServicesCost)}
                    </Text>
                  </View>
                )}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>{formatCurrency(pricing.totalCost)}</Text>
                </View>
              </View>
            </View>
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
