'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Download,
  Search,
  AlertCircle,
  CheckCircle,
  Calendar,
  Users,
  MapPin,
  Clock,
  Phone,
  Mail,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface BookingDetails {
  id: string
  type: 'hostel' | 'auditorium'
  fullName: string
  contactInfo: {
    whatsappNumber: string
    phoneNumber?: string
    egyptPhoneNumber?: string
  }
  [key: string]: unknown
}

interface BookingResponse {
  success: boolean
  conflict?: boolean
  type?: 'hostel' | 'auditorium'
  booking?: BookingDetails
  bookings?: Array<{ type: 'hostel' | 'auditorium'; booking: BookingDetails }>
  message?: string
}

export default function CheckBookingPage() {
  const [bookingId, setBookingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [conflictBookings, setConflictBookings] = useState<Array<{
    type: 'hostel' | 'auditorium'
    booking: BookingDetails
  }> | null>(null)
  const [error, setError] = useState('')

  const searchBooking = async () => {
    if (!bookingId.trim()) return

    setLoading(true)
    setError('')
    setBooking(null)
    setConflictBookings(null)

    try {
      const response = await fetch(`/api/booking/${bookingId}`)
      const data = await response.json()

      if (data.success) {
        if (data.conflict && data.bookings) {
          // Multiple bookings found with same ID
          setConflictBookings(data.bookings)
        } else {
          // Single booking found
          setBooking({ ...data.booking, type: data.type })
        }
      } else {
        setError('Booking tidak ditemukan. Pastikan ID booking Anda benar.')
      }
    } catch (_err) {
      setError('Terjadi kesalahan saat mencari booking. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const selectBooking = (selectedBooking: {
    type: 'hostel' | 'auditorium'
    booking: BookingDetails
  }) => {
    setBooking({ ...selectedBooking.booking, type: selectedBooking.type })
    setConflictBookings(null)
  }

  const downloadPDF = (bookingType?: 'hostel' | 'auditorium') => {
    if (!booking) return

    const type = bookingType || booking.type
    const url = `/api/booking/${booking.id}/pdf?type=${type}`
    const link = document.createElement('a')
    link.href = url
    link.download = `${type}_booking_${booking.id}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'INVOICED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'DOWNPAYMENT':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Lunas'
      case 'INVOICED':
        return 'Menunggu Pembayaran'
      case 'DOWNPAYMENT':
        return 'Uang Muka'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cek Status Booking</h1>
              <p className="text-gray-600">Hostel & Auditorium - Wisma Nusantara Cairo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Info Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Layanan Check Booking</h2>
                <p className="text-gray-600">
                  Cek status dan download konfirmasi untuk semua jenis booking
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🏨</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Booking Hostel</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Status kamar dan durasi menginap</li>
                    <li>• Info check-in/check-out</li>
                    <li>• Detail tamu dan fasilitas</li>
                    <li>• Konfirmasi pembayaran</li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎪</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Booking Auditorium</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Detail acara dan jadwal</li>
                    <li>• Layanan tambahan yang dipilih</li>
                    <li>• Informasi kontak dan harga</li>
                    <li>• Status pembayaran</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Masukkan ID Booking Anda
            </CardTitle>
            <CardDescription className="text-blue-100">
              Berlaku untuk booking Hostel dan Auditorium. Temukan ID booking di email konfirmasi
              atau pesan WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  🏨 Booking Hostel
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  🎪 Booking Auditorium
                </Badge>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Contoh: 507f1f77bcf86cd799439011"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchBooking()}
                className="flex-1 h-12 text-lg"
              />
              <Button
                onClick={searchBooking}
                disabled={loading || !bookingId.trim()}
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Mencari...' : 'Cari Booking'}
              </Button>
            </div>
            <div className="mt-3 text-sm text-gray-500 text-center">
              <p>💡 ID booking terdiri dari 24 karakter alfanumerik</p>
            </div>
          </CardContent>
        </Card>

        {/* Conflict Resolution */}
        {conflictBookings && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                Multiple Booking Ditemukan
              </CardTitle>
              <CardDescription className="text-yellow-700">
                ID booking ini memiliki 2 booking berbeda. Pilih salah satu untuk melihat detail:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conflictBookings.map((item, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:bg-gray-50 transition-colors border-2 hover:border-blue-300"
                    onClick={() => selectBooking(item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          className={
                            item.type === 'hostel'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }
                        >
                          {item.type === 'hostel' ? '🏨 Hostel' : '🎪 Auditorium'}
                        </Badge>
                      </div>
                      <p className="font-medium">{item.booking.fullName}</p>
                      <p className="text-sm text-gray-600">{item.booking.countryOfOrigin}</p>
                      {item.type === 'hostel' && item.booking.stayDuration && (
                        <p className="text-xs text-gray-500 mt-1">
                          Check-in: {formatDate(item.booking.stayDuration.checkInDate)}
                        </p>
                      )}
                      {item.type === 'auditorium' && item.booking.eventDetails && (
                        <p className="text-xs text-gray-500 mt-1">
                          Event: {item.booking.eventDetails.eventName}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Booking Tidak Ditemukan</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                  <div className="text-sm text-red-600 mt-2">
                    <p>
                      <strong>Tips:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>Pastikan ID booking terdiri dari 24 karakter</li>
                      <li>Cek kembali email atau WhatsApp konfirmasi</li>
                      <li>ID booking berlaku untuk hostel dan auditorium</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Details */}
        {booking && (
          <div className="space-y-6">
            {/* Header Card */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{booking.fullName}</h2>
                      <Badge className={`${getStatusColor(booking.paymentStatus)} border`}>
                        {getStatusText(booking.paymentStatus)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Badge variant="outline" className="font-medium">
                        {booking.type === 'hostel' ? '🏨 Booking Hostel' : '🎪 Booking Auditorium'}
                      </Badge>
                      <span className="text-sm">•</span>
                      <span className="text-sm">ID: {booking.id}</span>
                    </div>
                  </div>
                  <Button onClick={downloadPDF} className="bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download Konfirmasi PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Details Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Info */}
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    Informasi Pribadi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama Lengkap:</span>
                    <span className="font-medium">{booking.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Asal Negara:</span>
                    <span className="font-medium">{booking.countryOfOrigin}</span>
                  </div>
                  {booking.passportNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">No. Paspor:</span>
                      <span className="font-medium">{booking.passportNumber}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                    Informasi Kontak
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">WhatsApp:</span>
                    <span className="font-medium">{booking.contactInfo.whatsappNumber}</span>
                  </div>
                  {booking.contactInfo.phoneNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Telepon:</span>
                      <span className="font-medium">{booking.contactInfo.phoneNumber}</span>
                    </div>
                  )}
                  {booking.contactInfo.egyptPhoneNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Telepon Mesir:</span>
                      <span className="font-medium">{booking.contactInfo.egyptPhoneNumber}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Type Specific Details */}
            {booking.type === 'hostel' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stay Duration */}
                <Card className="shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      Durasi Menginap
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-gray-600 block mb-1">Check-in:</span>
                      <span className="font-medium text-lg">
                        {formatDate(booking.stayDuration.checkInDate)}
                      </span>
                    </div>
                    <Separator />
                    <div>
                      <span className="text-gray-600 block mb-1">Check-out:</span>
                      <span className="font-medium text-lg">
                        {formatDate(booking.stayDuration.checkOutDate)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Room & Guests */}
                <Card className="shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-orange-600" />
                      Kamar & Tamu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dewasa:</span>
                      <span className="font-medium">{booking.guestDetails.adults} orang</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Anak-anak:</span>
                      <span className="font-medium">{booking.guestDetails.children} orang</span>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      {booking.roomSelection.singleBed > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Single Bed:</span>
                          <span className="font-medium">
                            {booking.roomSelection.singleBed} kamar
                          </span>
                        </div>
                      )}
                      {booking.roomSelection.doubleBed > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Double Bed:</span>
                          <span className="font-medium">
                            {booking.roomSelection.doubleBed} kamar
                          </span>
                        </div>
                      )}
                      {booking.roomSelection.extraBed > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Extra Bed:</span>
                          <span className="font-medium">{booking.roomSelection.extraBed} bed</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {booking.type === 'auditorium' && (
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    Detail Acara
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-gray-600 block mb-1">Nama Acara:</span>
                    <span className="font-medium text-xl">{booking.eventDetails.eventName}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 block mb-1">Tanggal:</span>
                      <span className="font-medium">
                        {formatDate(booking.eventDetails.eventDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 block mb-1">Waktu:</span>
                      <span className="font-medium">
                        {booking.eventDetails.eventTime} - {booking.eventDetails.eventEndTime}
                      </span>
                    </div>
                  </div>
                  {booking.eventNotes && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-gray-600 block mb-1">Catatan:</span>
                        <span className="font-medium">{booking.eventNotes}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Status Info */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-lg">Booking Berhasil Dikonfirmasi</p>
                    <p className="text-gray-600">
                      Konfirmasi booking telah dikirim via WhatsApp dan email.
                      {booking.type === 'hostel'
                        ? ' Silakan datang pada tanggal check-in yang telah ditentukan.'
                        : ' Silakan datang sesuai waktu acara yang dijadwalkan.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 mt-12 py-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-sm">
              <strong>Layanan Check Booking 24/7</strong> - Cek status booking hostel dan auditorium
              kapan saja
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <span>✅ Booking Hostel</span>
              <span>✅ Booking Auditorium</span>
              <span>✅ Download PDF</span>
              <span>✅ Real-time Status</span>
            </div>
            <p className="text-xs text-gray-400">
              Butuh bantuan? Hubungi kami di WhatsApp atau email untuk pertanyaan lebih lanjut.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
