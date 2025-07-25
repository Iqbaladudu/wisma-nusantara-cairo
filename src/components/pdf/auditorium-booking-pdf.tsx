import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { AuditoriumBookingFormData } from '@/lib/schemas'

// Use system fonts for better compatibility
// Font registration commented out to avoid loading issues
/*
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfAZhrib2Bg-4.woff2', fontWeight: 'bold' },
  ],
})
*/

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
    borderBottomColor: '#7c3aed',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#581c87',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
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
  facilitySection: {
    backgroundColor: '#faf5ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  facilityTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7c3aed',
    marginBottom: 8,
  },
  facilityItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  facilityBullet: {
    width: 10,
    fontSize: 10,
    color: '#7c3aed',
  },
  facilityText: {
    flex: 1,
    fontSize: 9,
    color: '#581c87',
  },
  paymentSection: {
    backgroundColor: '#fef3c7',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  paymentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d97706',
    marginBottom: 8,
  },
  paymentStatus: {
    backgroundColor: '#fbbf24',
    color: '#92400e',
    padding: 6,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  paymentText: {
    fontSize: 9,
    color: '#d97706',
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
  importantNotes: {
    backgroundColor: '#fef2f2',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  importantTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  importantItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  importantBullet: {
    width: 10,
    fontSize: 10,
    color: '#dc2626',
  },
  importantText: {
    flex: 1,
    fontSize: 9,
    color: '#dc2626',
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
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
}

export function AuditoriumBookingPDF({ bookingData, bookingId }: AuditoriumBookingPDFProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  const formatTime = (time: string) => {
    return time + ' WIB'
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>KONFIRMASI BOOKING AUDITORIUM</Text>
          <Text style={styles.subtitle}>Wisma Nusantara Cairo</Text>
          <Text style={styles.subtitle}>
            Booking berhasil untuk {bookingData.eventDetails.eventName}
          </Text>
          {bookingId && <Text style={styles.bookingId}>Booking ID: {bookingId}</Text>}
        </View>

        {/* Main Content Grid */}
        <View style={styles.grid}>
          {/* Left Column */}
          <View style={styles.gridItem}>
            {/* Event Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detail Acara</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Nama Acara:</Text>
                <Text style={styles.value}>{bookingData.eventDetails.eventName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Tanggal Acara:</Text>
                <Text style={styles.value}>{formatDate(bookingData.eventDetails.eventDate)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Waktu Acara:</Text>
                <Text style={styles.value}>{formatTime(bookingData.eventDetails.eventTime)}</Text>
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
                <Text style={styles.label}>Nomor Telepon Egypt:</Text>
                <Text style={styles.value}>{bookingData.contactInfo.egyptPhoneNumber}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>WhatsApp:</Text>
                <Text style={styles.value}>{bookingData.contactInfo.whatsappNumber}</Text>
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

          {/* Right Column */}
          <View style={styles.gridItem}>
            {/* Auditorium Information */}
            <View style={styles.facilitySection}>
              <Text style={styles.facilityTitle}>Auditorium Wisma Nusantara</Text>
              <View style={styles.facilityItem}>
                <Text style={styles.facilityBullet}>•</Text>
                <Text style={styles.facilityText}>Kapasitas: 150 orang</Text>
              </View>
              <View style={styles.facilityItem}>
                <Text style={styles.facilityBullet}>•</Text>
                <Text style={styles.facilityText}>Proyektor HD & Layar Besar</Text>
              </View>
              <View style={styles.facilityItem}>
                <Text style={styles.facilityBullet}>•</Text>
                <Text style={styles.facilityText}>Sound System Professional</Text>
              </View>
              <View style={styles.facilityItem}>
                <Text style={styles.facilityBullet}>•</Text>
                <Text style={styles.facilityText}>Microphone Wireless & Kabel</Text>
              </View>
              <View style={styles.facilityItem}>
                <Text style={styles.facilityBullet}>•</Text>
                <Text style={styles.facilityText}>AC & Pencahayaan Optimal</Text>
              </View>
              <View style={styles.facilityItem}>
                <Text style={styles.facilityBullet}>•</Text>
                <Text style={styles.facilityText}>WiFi High Speed</Text>
              </View>
            </View>

            {/* Payment Information */}
            <View style={styles.paymentSection}>
              <Text style={styles.paymentTitle}>Status Pembayaran</Text>
              <Text style={styles.paymentStatus}>MENUNGGU INVOICE</Text>
              <Text style={styles.paymentText}>
                Tim kami akan mengirimkan invoice dan detail pembayaran melalui email dalam 24 jam.
              </Text>
            </View>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextSteps}>
          <Text style={styles.nextStepsTitle}>Langkah Selanjutnya</Text>
          <View style={styles.nextStepItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.nextStepText}>
              Anda akan menerima konfirmasi booking melalui email dalam 1-2 jam
            </Text>
          </View>
          <View style={styles.nextStepItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.nextStepText}>
              Tim kami akan menghubungi Anda via WhatsApp dalam 24 jam untuk konfirmasi detail acara
            </Text>
          </View>
          <View style={styles.nextStepItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.nextStepText}>
              Invoice akan dikirim setelah konfirmasi detail acara
            </Text>
          </View>
          <View style={styles.nextStepItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.nextStepText}>
              Koordinasi teknis akan dilakukan 1 minggu sebelum acara
            </Text>
          </View>
        </View>

        {/* Important Notes */}
        <View style={styles.importantNotes}>
          <Text style={styles.importantTitle}>Catatan Penting</Text>
          <View style={styles.importantItem}>
            <Text style={styles.importantBullet}>•</Text>
            <Text style={styles.importantText}>
              Pembayaran harus dilakukan minimal 7 hari sebelum acara
            </Text>
          </View>
          <View style={styles.importantItem}>
            <Text style={styles.importantBullet}>•</Text>
            <Text style={styles.importantText}>
              Perubahan jadwal dapat dilakukan maksimal 3 hari sebelum acara
            </Text>
          </View>
          <View style={styles.importantItem}>
            <Text style={styles.importantBullet}>•</Text>
            <Text style={styles.importantText}>
              Pembatalan dengan pengembalian dana 50% jika dilakukan minimal 7 hari sebelum acara
            </Text>
          </View>
          <View style={styles.importantItem}>
            <Text style={styles.importantBullet}>•</Text>
            <Text style={styles.importantText}>
              Simpan dokumen ini sebagai referensi booking Anda
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Butuh bantuan? Hubungi customer service kami</Text>
          <Text style={styles.contact}>
            WhatsApp: +20 123 456 7890 | Email: auditorium@wismanusantara.com
          </Text>
          <Text style={styles.footerText}>
            Wisma Nusantara Cairo - Your Professional Event Partner
          </Text>
        </View>
      </Page>
    </Document>
  )
}
