'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  CheckCircle,
  Calendar,
  Users,
  Bed,
  Phone,
  Mail,
  ArrowLeft,
  Download,
  Share2,
  Eye,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { HostelBookingFormData } from '@/lib/schemas'
import { calculateBookingPrice } from '@/lib/api'
import { previewHostelBookingPDF, generatePDFWithFeedback } from '@/lib/pdf-utils'

// Loading component for Suspense fallback
function ConfirmationLoading() {
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
function HostelConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [bookingData, setBookingData] = useState<HostelBookingFormData | null>(null)
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
        if (decodedData.stayDuration) {
          decodedData.stayDuration.checkInDate = new Date(decodedData.stayDuration.checkInDate)
          decodedData.stayDuration.checkOutDate = new Date(decodedData.stayDuration.checkOutDate)
        }
        if (decodedData.departureDateTime?.departureDate) {
          decodedData.departureDateTime.departureDate = new Date(
            decodedData.departureDateTime.departureDate,
          )
        }

        // Add default acceptTerms if missing (for backward compatibility)
        if (decodedData.acceptTerms === undefined) {
          decodedData.acceptTerms = true
        }

        setBookingData(decodedData)
        setBookingId(id)
      } catch (error) {
        console.error('Error parsing booking data:', error)
        router.push('/hostel')
      }
    } else {
      // Redirect back to hostel page if no data
      router.push('/hostel')
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

  const handleDownloadPDF = async () => {
    if (!bookingData) return

    try {
      setIsGeneratingPDF(true)

      await generatePDFWithFeedback('hostel', bookingData, bookingId || undefined, (message) => {
        setPdfProgress(message)
        toast.info(message)
      })
      toast.success('PDF berhasil diunduh!')
    } catch (error) {
      console.error('Download PDF error:', error)
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

      await previewHostelBookingPDF(bookingData, bookingId || undefined)
      toast.success('PDF dibuka di tab baru')
    } catch (error) {
      console.error('Preview PDF error:', error)
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
          title: 'Booking Confirmation - Wisma Nusantara',
          text: `Booking confirmation for ${bookingData?.fullName}`,
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-2">
            Booking Berhasil!
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Terima kasih, {bookingData.fullName}. Booking Anda telah berhasil dikirim.
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
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Nomor Paspor</span>
                  <p className="font-medium font-mono">{bookingData.passportNumber}</p>
                </div>
              </CardContent>
            </Card>

            {/* Room Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bed className="h-5 w-5" />
                  Pilihan Kamar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bookingData.roomSelection.singleBed > 0 && (
                  <div className="flex justify-between">
                    <span>Single Bed Room</span>
                    <Badge variant="outline">{bookingData.roomSelection.singleBed} kamar</Badge>
                  </div>
                )}
                {bookingData.roomSelection.doubleBed > 0 && (
                  <div className="flex justify-between">
                    <span>Double Bed Room</span>
                    <Badge variant="outline">{bookingData.roomSelection.doubleBed} kamar</Badge>
                  </div>
                )}
                {bookingData.roomSelection.extraBed > 0 && (
                  <div className="flex justify-between">
                    <span>Extra Bed</span>
                    <Badge variant="outline">{bookingData.roomSelection.extraBed} tempat</Badge>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span>Total Tamu</span>
                  <span className="font-medium">
                    {bookingData.guestDetails.adults} dewasa, {bookingData.guestDetails.children}{' '}
                    anak
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Stay Duration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Durasi Menginap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Check-in</span>
                  <p className="font-medium">{formatDate(bookingData.stayDuration.checkInDate)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Check-out</span>
                  <p className="font-medium">{formatDate(bookingData.stayDuration.checkOutDate)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Lama Menginap</span>
                  <p className="font-medium">{pricing.breakdown.nights} malam</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact & Summary */}
          <div className="space-y-6">
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
                  <span className="text-sm font-medium text-muted-foreground">WhatsApp</span>
                  <p className="font-medium font-mono">{bookingData.contactInfo.whatsappNumber}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Telepon</span>
                  <p className="font-medium font-mono">{bookingData.contactInfo.phoneNumber}</p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Biaya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Biaya Kamar ({pricing.breakdown.nights} malam)</span>
                  <span className="font-medium">{formatCurrency(pricing.roomCost)}</span>
                </div>
                {pricing.additionalServicesCost > 0 && (
                  <div className="flex justify-between">
                    <span>Layanan Tambahan</span>
                    <span className="font-medium">
                      {formatCurrency(pricing.additionalServicesCost)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(pricing.totalCost)}</span>
                </div>
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
                  <p>Anda akan menerima konfirmasi booking melalui email dalam 1-5 menit</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p>Simpan halaman ini sebagai referensi booking Anda</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mt-8 flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() => router.push('/hostel')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Hostel
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
export default function HostelConfirmationPage() {
  return (
    <Suspense fallback={<ConfirmationLoading />}>
      <HostelConfirmationContent />
    </Suspense>
  )
}
