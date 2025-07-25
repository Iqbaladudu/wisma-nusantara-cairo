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
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false)
  const [whatsappSent, setWhatsappSent] = useState(false)

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

  const handleSendWhatsApp = async () => {
    if (!bookingData) return

    try {
      setIsSendingWhatsApp(true)
      toast.info('Mengirim konfirmasi via WhatsApp...')

      const response = await fetch('/api/whatsapp/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'auditorium',
          bookingData,
          bookingId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setWhatsappSent(true)
        toast.success('Konfirmasi berhasil dikirim via WhatsApp!')
      } else {
        throw new Error(result.error || 'Gagal mengirim konfirmasi')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengirim konfirmasi via WhatsApp')
    } finally {
      setIsSendingWhatsApp(false)
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
                  <span className="text-sm font-medium text-muted-foreground">Waktu Acara</span>
                  <p className="font-medium">{formatTime(bookingData.eventDetails.eventTime)}</p>
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
            <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
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
                  Tim kami akan mengirimkan invoice dan detail pembayaran melalui email dalam 24
                  jam.
                </p>
              </CardContent>
            </Card>

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
                  <p>Anda akan menerima konfirmasi booking melalui email dalam 1-2 jam</p>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p>
                    Tim kami akan menghubungi Anda via WhatsApp dalam 24 jam untuk konfirmasi detail
                    acara
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p>Invoice akan dikirim setelah konfirmasi detail acara</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p>Koordinasi teknis akan dilakukan 1 minggu sebelum acara</p>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-200">Catatan Penting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-red-700 dark:text-red-300">
                <p>• Pembayaran harus dilakukan minimal 7 hari sebelum acara</p>
                <p>• Perubahan jadwal dapat dilakukan maksimal 3 hari sebelum acara</p>
                <p>
                  • Pembatalan dengan pengembalian dana 50% jika dilakukan minimal 7 hari sebelum
                  acara
                </p>
                <p>• Simpan halaman ini sebagai referensi booking Anda</p>
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
            onClick={handleSendWhatsApp}
            variant={whatsappSent ? 'secondary' : 'outline'}
            className="flex items-center gap-2"
            disabled={isSendingWhatsApp || whatsappSent}
          >
            <MessageCircle className="h-4 w-4" />
            {isSendingWhatsApp ? 'Mengirim...' : whatsappSent ? 'Terkirim ✓' : 'Kirim via WhatsApp'}
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
              href="https://wa.me/1234567890"
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            <span className="text-muted-foreground">•</span>
            <a
              href="mailto:info@wismanusantara.com"
              className="text-primary hover:underline font-medium"
            >
              Email
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
