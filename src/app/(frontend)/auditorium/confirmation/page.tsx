'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  CheckCircle,
  Calendar,
  Users,
  Phone,
  Mail,
  ArrowLeft,
  Download,
  Share2,
  MapPin,
  Eye,
  MessageCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AuditoriumBookingFormData } from '@/lib/schemas'
import {
  downloadAuditoriumBookingPDF,
  previewAuditoriumBookingPDF,
  generatePDFWithFeedback,
} from '@/lib/pdf-utils'
import { calculateAuditoriumPrice, calculateExcludeServicesPrice } from '@/lib/api'

// Loading component for Suspense fallback
function AuditoriumConfirmationLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading confirmation...</p>
      </div>
    </div>
  )
}

// Main confirmation component that uses useSearchParams
function AuditoriumConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [bookingData, setBookingData] = useState<AuditoriumBookingFormData | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [pdfProgress, setPdfProgress] = useState<string>('')

  useEffect(() => {
    // Get booking data from URL params (base64 encoded)
    const encodedData = searchParams.get('data')
    const id = searchParams.get('id')

    if (encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData))
        // Convert date strings back to Date objects
        if (decodedData.eventDetails?.eventDate) {
          decodedData.eventDetails.eventDate = new Date(decodedData.eventDetails.eventDate)
        }
        setBookingData(decodedData)
        setBookingId(id)
      } catch (error) {
        router.push('/auditorium')
      }
    } else {
      // Redirect back to auditorium page if no data
      router.push('/auditorium')
    }
  }, [searchParams, router])

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading confirmation...</p>
        </div>
      </div>
    )
  }

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

  const handleDownloadPDF = async () => {
    if (!bookingData) return

    try {
      setIsGeneratingPDF(true)
      await generatePDFWithFeedback(
        'auditorium',
        bookingData,
        bookingId || undefined,
        (message) => {
          setPdfProgress(message)
          toast.info(message)
        },
      )
      toast.success('PDF berhasil diunduh!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengunduh PDF')
    } finally {
      setIsGeneratingPDF(false)
      setPdfProgress('')
    }
  }

  const handlePreviewPDF = async () => {
    if (!bookingData) return

    try {
      setIsGeneratingPDF(true)
      setPdfProgress('Membuka preview PDF...')
      await previewAuditoriumBookingPDF(bookingData, bookingId || undefined)
      toast.success('PDF dibuka di tab baru')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal membuka preview PDF')
    } finally {
      setIsGeneratingPDF(false)
      setPdfProgress('')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Booking Confirmation - Auditorium Wisma Nusantara',
          text: `Booking confirmation for ${bookingData?.eventDetails.eventName}`,
          url: window.location.href,
        })
      } catch (error) {
        // Silently handle sharing errors
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link berhasil disalin ke clipboard!')
      } catch (error) {
        toast.error('Gagal menyalin link')
      }
    }
  }

  // Calculate pricing
  const basePricing = calculateAuditoriumPrice(
    bookingData.eventDetails.eventTime,
    bookingData.eventDetails.eventEndTime,
  )

  const excludeServicesPricing = calculateExcludeServicesPrice(bookingData.excludeServices)
  const totalPrice = basePricing.totalPrice + excludeServicesPricing.totalPrice

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-2">
            Booking Auditorium Berhasil!
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Terima kasih, {bookingData.fullName}. Booking auditorium Anda telah berhasil dikirim.
            Harap segera hubungi admin Wisma Nusantara untuk konfirmasi.
          </p>
          {bookingId && (
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border">
              <span className="text-sm font-medium">Booking ID:</span>
              <Badge variant="secondary" className="font-mono">
                {bookingId}
              </Badge>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto grid gap-6 lg:grid-cols-2">
          {/* Booking Details */}
          <div className="space-y-6">
            {/* Event Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Detail Acara
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Nama Acara</span>
                  <p className="font-medium text-lg">{bookingData.eventDetails.eventName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Tanggal Acara</span>
                  <p className="font-medium">{formatDate(bookingData.eventDetails.eventDate)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Waktu Mulai</span>
                  <p className="font-medium">{formatTime(bookingData.eventDetails.eventTime)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Waktu Selesai</span>
                  <p className="font-medium">{formatTime(bookingData.eventDetails.eventEndTime)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Informasi Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Nama Lengkap</span>
                  <p className="font-medium">{bookingData.fullName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Asal Negara</span>
                  <p className="font-medium">{bookingData.countryOfOrigin}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Informasi Kontak
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Nomor Telepon Egypt
                  </span>
                  <p className="font-medium font-mono">
                    {bookingData.contactInfo.egyptPhoneNumber}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">WhatsApp</span>
                  <p className="font-medium font-mono">{bookingData.contactInfo.whatsappNumber}</p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            {(bookingData.couponCode || bookingData.eventNotes) && (
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Tambahan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {bookingData.couponCode && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Kode Kupon</span>
                      <p className="font-medium font-mono">{bookingData.couponCode}</p>
                    </div>
                  )}
                  {bookingData.eventNotes && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Catatan Acara
                      </span>
                      <p className="font-medium">{bookingData.eventNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Exclude Services */}
            {excludeServicesPricing.totalPrice > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Layanan Tambahan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {excludeServicesPricing.breakdown.map((service, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        • {service.split(':')[0]}
                      </span>
                      <Badge variant="outline">{service.split(':')[1]?.trim()}</Badge>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center font-medium">
                    <span>Total Layanan Tambahan</span>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {excludeServicesPricing.totalPrice} EGP
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary & Next Steps */}
          <div className="space-y-6">
            {/* Auditorium Information */}
            <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                  <MapPin className="h-5 w-5" />
                  Auditorium Wisma Nusantara
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Kapasitas:</span> 150 orang
                </div>
                <div>
                  <span className="font-medium">Fasilitas:</span> Proyektor, Sound System, AC, WiFi
                </div>
                <div>
                  <span className="font-medium">Lokasi:</span> Wisma Nusantara, Cairo, Egypt
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            {/* <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="text-amber-800 dark:text-amber-200">
                  Status Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                    Menunggu Invoice
                  </Badge>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Kamu akan menerima invoice dan detail
                </p>
              </CardContent>
            </Card> */}

            {/* Next Steps */}
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">
                  Langkah Selanjutnya
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p>Harap konfirmasi booking Anda melalui Whatsapp kepada admin Wisma Nusantara</p>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-200">Catatan Penting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-red-700 dark:text-red-300">
                <p>• Pembayaran dilakukan setelah acara</p>
                <p>• Anda dapat menghubungi hotline kami jika membutuhkan layanan tambahan</p>
              </CardContent>
            </Card>
            {/* Pricing Summary */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200">
                  Ringkasan Biaya
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <Badge variant="secondary" className="mb-2 text-lg px-3 py-1">
                      {basePricing.totalHours} Jam
                    </Badge>
                    <p className="text-sm text-muted-foreground">Durasi Acara</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                    <Badge variant="outline" className="mb-2 text-lg px-3 py-1">
                      {basePricing.totalPrice} EGP
                    </Badge>
                    <p className="text-sm text-muted-foreground">Biaya Auditorium</p>
                  </div>
                  {excludeServicesPricing.totalPrice > 0 && (
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <Badge variant="outline" className="mb-2 text-lg px-3 py-1">
                        {excludeServicesPricing.totalPrice} EGP
                      </Badge>
                      <p className="text-sm text-muted-foreground">Layanan Tambahan</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="text-center p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                  <div className="flex justify-center items-center gap-2 mb-2">
                    <span className="text-lg font-medium text-green-800 dark:text-green-200">
                      TOTAL BIAYA:
                    </span>
                    <Badge
                      variant="default"
                      className="text-xl px-4 py-2 bg-green-600 hover:bg-green-700"
                    >
                      {totalPrice} EGP
                    </Badge>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Paket: {basePricing.priceBreakdown}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mt-8 flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() => router.push('/auditorium')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Auditorium
          </Button>
          <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Bagikan
          </Button>
          <Button
            onClick={handlePreviewPDF}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isGeneratingPDF}
          >
            <Eye className="h-4 w-4" />
            {isGeneratingPDF ? 'Membuat...' : 'Preview PDF'}
          </Button>
          <Button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2"
            disabled={isGeneratingPDF}
          >
            <Download className="h-4 w-4" />
            {isGeneratingPDF ? pdfProgress || 'Membuat PDF...' : 'Download PDF'}
          </Button>
        </div>

        {/* Footer */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Butuh bantuan? Hubungi customer service kami
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://wa.me/+201555336481"
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense wrapper
export default function AuditoriumConfirmationPage() {
  return (
    <Suspense fallback={<AuditoriumConfirmationLoading />}>
      <AuditoriumConfirmationContent />
    </Suspense>
  )
}
