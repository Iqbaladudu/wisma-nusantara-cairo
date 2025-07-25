import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { HostelBookingFormData } from '@/lib/schemas'
import { calculateBookingPrice } from '@/lib/api'

// Use system fonts for better compatibility
// Font registration removed to avoid loading issues

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
  termsItem: {
    marginBottom: 8,
  },
  termsItemTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 3,
  },
  termsItemContent: {
    fontSize: 8,
    color: '#451a03',
    lineHeight: 1.3,
    marginLeft: 5,
  },
  termsWarning: {
    fontSize: 8,
    color: '#dc2626',
    fontWeight: 'bold',
  },
  // Terms Page Styles
  termsPageHeader: {
    marginBottom: 30,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: '#f59e0b',
    paddingBottom: 20,
  },
  termsPageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 5,
  },
  termsPageSubtitle: {
    fontSize: 12,
    color: '#92400e',
    marginBottom: 2,
  },
  termsContent: {
    flex: 1,
  },
  termsItemContentEn: {
    fontSize: 8,
    color: '#451a03',
    lineHeight: 1.3,
    marginLeft: 5,
    marginTop: 3,
  },
  termsWarningEn: {
    fontSize: 8,
    color: '#dc2626',
    fontWeight: 'bold',
    marginTop: 3,
  },
  termsPageFooter: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#f59e0b',
    textAlign: 'center',
  },
})

interface HostelBookingPDFProps {
  bookingData: HostelBookingFormData
  bookingId?: string
}

export function HostelBookingPDF({ bookingData, bookingId }: HostelBookingPDFProps) {
  const pricing = calculateBookingPrice(bookingData)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
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
              Anda akan menerima konfirmasi booking melalui email dalam 1-2 jam
            </Text>
          </View>
          <View style={styles.nextStepItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.nextStepText}>
              Tim kami akan menghubungi Anda via WhatsApp dalam 24 jam untuk konfirmasi pembayaran
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
          <Text style={styles.contact}>
            WhatsApp: +20 123 456 7890 | Email: info@wismanusantara.com
          </Text>
          <Text style={styles.footerText}>Wisma Nusantara Cairo - Your Home Away From Home</Text>
        </View>
      </Page>

      {/* Second Page - Terms of Service */}
      <Page size="A4" style={styles.page}>
        {/* Header for Terms Page */}
        <View style={styles.termsPageHeader}>
          <Text style={styles.termsPageTitle}>SYARAT DAN KETENTUAN</Text>
          <Text style={styles.termsPageSubtitle}>TERMS OF SERVICE</Text>
          <Text style={styles.termsPageSubtitle}>Wisma Nusantara Cairo</Text>
        </View>

        {/* Terms Content */}
        <View style={styles.termsContent}>
          {/* Check-in Policy */}
          <View style={styles.termsItem}>
            <Text style={styles.termsItemTitle}>1. Jam Check-in / Check-in Time:</Text>
            <Text style={styles.termsItemContent}>
              • Waktu check-in adalah mulai pukul 13.00 s/d 22.00.{'\n'}• Early check-in
              (08.00-12.00) dikenakan biaya tambahan USD 5.{'\n'}• Check-in (22.00-06.00) dikenakan
              biaya penuh + USD 5.{'\n'}• Check-in (06.00-08.00) dikenakan biaya USD 15.
            </Text>
            <Text style={styles.termsItemContentEn}>
              • Check-in time is from 1:00 PM to 10:00 PM.{'\n'}• Early check-in (8:00 AM - 12:00
              PM) incurs an additional fee of USD 5.{'\n'}• Check-in (10:00 PM - 6:00 AM) incurs the
              full payment plus USD 5.{'\n'}• Check-in (6:00 AM - 8:00 AM) incurs a fee of USD 15.
            </Text>
          </View>

          {/* Check-out Policy */}
          <View style={styles.termsItem}>
            <Text style={styles.termsItemTitle}>2. Jam Check-out / Check-out Time:</Text>
            <Text style={styles.termsItemContent}>
              • Batas maksimal check-out adalah pukul 12.00 siang.{'\n'}• Late check-out
              (13.00-16.00) dikenakan biaya tambahan USD 5.{'\n'}• Late check-out (16.00-18.00)
              dikenakan biaya tambahan USD 15.{'\n'}• Check-out (18.00-12.00 hari berikutnya)
              dikenakan biaya penuh.
            </Text>
            <Text style={styles.termsItemContentEn}>
              • The maximum check-out time is 12:00 PM noon.{'\n'}• Late check-out (1:00 PM - 4:00
              PM) incurs an additional fee of USD 5.{'\n'}• Late check-out (4:00 PM - 6:00 PM)
              incurs an additional fee of USD 15.{'\n'}• Check-out (6:00 PM - 12:00 PM the following
              day) incurs the full payment.
            </Text>
          </View>

          {/* Cancellation Policy */}
          <View style={styles.termsItem}>
            <Text style={styles.termsItemTitle}>
              3. Kebijakan Pembatalan / Cancellation Policy:
            </Text>
            <Text style={styles.termsWarning}>
              PENTING: Pembatalan H-3 hingga Hari-H dikenakan biaya pembatalan seharga 1 malam
              menginap per kamar.
            </Text>
            <Text style={styles.termsWarningEn}>
              IMPORTANT: Cancellations made from 3 days prior to arrival until the arrival date (H-3
              to D-Day) will incur a cancellation fee equivalent to the cost of 1 night's stay per
              reserved room.
            </Text>
          </View>

          {/* Smoking Policy */}
          <View style={styles.termsItem}>
            <Text style={styles.termsItemTitle}>4. Kebijakan Merokok / Smoking Policy:</Text>
            <Text style={styles.termsWarning}>
              PENTING: Seluruh area Wisma Nusantara & semua kamar adalah area dilarang merokok.
              {'\n'}
              DENDA: Pelanggaran dikenakan biaya tambahan USD 100.
            </Text>
            <Text style={styles.termsWarningEn}>
              IMPORTANT: All areas of Wisma Nusantara & all rooms are designated as non-smoking
              areas.{'\n'}
              FINE: Guests agree to pay an additional fee of 100 USD for violating the smoking
              policy.
            </Text>
          </View>

          {/* Damage Policy */}
          <View style={styles.termsItem}>
            <Text style={styles.termsItemTitle}>
              5. Kerusakan dan Kehilangan / Damage and Loss:
            </Text>
            <Text style={styles.termsItemContent}>
              • Tamu bertanggung jawab atas segala kerusakan pada kamar atau properti hotel selama
              menginap.
            </Text>
            <Text style={styles.termsItemContentEn}>
              • Guests agree to be responsible for any damage caused to the room or hotel property
              during their stay.
            </Text>
          </View>

          {/* Force Majeure */}
          <View style={styles.termsItem}>
            <Text style={styles.termsItemTitle}>6. Keadaan Tak Terduga / Force Majeure:</Text>
            <Text style={styles.termsItemContent}>
              Wisma Nusantara tidak bertanggung jawab atas kegagalan memenuhi kewajibannya jika
              terjadi keadaan tak terduga di luar kendali.
            </Text>
            <Text style={styles.termsItemContentEn}>
              Wisma Nusantara shall not be held responsible for failure to fulfill its obligations
              in the event of unforeseen circumstances beyond its control.
            </Text>
          </View>

          {/* Terms Modification */}
          <View style={styles.termsItem}>
            <Text style={styles.termsItemTitle}>7. Perubahan Syarat / Terms Modification:</Text>
            <Text style={styles.termsItemContent}>
              Wisma Nusantara berhak untuk mengubah syarat dan ketentuan ini tanpa pemberitahuan
              sebelumnya.
            </Text>
            <Text style={styles.termsItemContentEn}>
              Wisma Nusantara reserves the right to modify these terms and conditions without prior
              notice.
            </Text>
          </View>
        </View>

        {/* Terms Page Footer */}
        <View style={styles.termsPageFooter}>
          <Text style={styles.footerText}>
            Dengan melakukan booking, Anda menyetujui semua syarat dan ketentuan di atas
          </Text>
          <Text style={styles.footerText}>
            By making a booking, you agree to all the terms and conditions above
          </Text>
        </View>
      </Page>
    </Document>
  )
}
