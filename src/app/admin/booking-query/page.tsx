'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Send, Search, AlertCircle, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface BookingDetails {
  id: string
  type: 'hostel' | 'auditorium'
  fullName: string
  contactInfo: {
    whatsappNumber: string
    phoneNumber?: string
    egyptPhoneNumber?: string
  }
  [key: string]: any
}

export default function BookingQueryPage() {
  const [bookingId, setBookingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [error, setError] = useState('')
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false)
  const [whatsappResult, setWhatsappResult] = useState<string | null>(null)

  const searchBooking = async () => {
    if (!bookingId.trim()) return

    setLoading(true)
    setError('')
    setBooking(null)
    setWhatsappResult(null)

    try {
      const response = await fetch(`/api/booking/${bookingId}`)
      const data = await response.json()

      if (data.success) {
        setBooking({ ...data.booking, type: data.type })
      } else {
        setError(data.error || 'Booking not found')
      }
    } catch (err) {
      setError('Failed to fetch booking')
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = () => {
    if (!booking) return

    const url = `/api/booking/${booking.id}/pdf`
    const link = document.createElement('a')
    link.href = url
    link.download = `${booking.type}_booking_${booking.id}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resendWhatsApp = async () => {
    if (!booking) return

    setSendingWhatsApp(true)
    setWhatsappResult(null)

    try {
      const response = await fetch(`/api/booking/${booking.id}/resend`, {
        method: 'POST',
      })
      const data = await response.json()

      if (data.success) {
        setWhatsappResult('✅ WhatsApp confirmation sent successfully!')
      } else {
        setWhatsappResult(`❌ Failed to send WhatsApp: ${data.error}`)
      }
    } catch (err) {
      setWhatsappResult('❌ Failed to send WhatsApp confirmation')
    } finally {
      setSendingWhatsApp(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Query Booking Confirmation
            </CardTitle>
            <CardDescription>
              Enter booking ID to view details and manage confirmation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter booking ID..."
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchBooking()}
              />
              <Button onClick={searchBooking} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            </CardContent>
          </Card>
        )}

        {booking && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Booking Details
                  <Badge variant={booking.type === 'hostel' ? 'default' : 'secondary'}>
                    {booking.type === 'hostel' ? 'Hostel' : 'Auditorium'}
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button onClick={downloadPDF} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={resendWhatsApp}
                    variant="outline"
                    size="sm"
                    disabled={sendingWhatsApp}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {sendingWhatsApp ? 'Sending...' : 'Resend WhatsApp'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Personal Information</h4>
                  <p>
                    <strong>Name:</strong> {booking.fullName}
                  </p>
                  <p>
                    <strong>Country:</strong> {booking.countryOfOrigin}
                  </p>
                  {booking.passportNumber && (
                    <p>
                      <strong>Passport:</strong> {booking.passportNumber}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <p>
                    <strong>WhatsApp:</strong> {booking.contactInfo.whatsappNumber}
                  </p>
                  {booking.contactInfo.phoneNumber && (
                    <p>
                      <strong>Phone:</strong> {booking.contactInfo.phoneNumber}
                    </p>
                  )}
                  {booking.contactInfo.egyptPhoneNumber && (
                    <p>
                      <strong>Egypt Phone:</strong> {booking.contactInfo.egyptPhoneNumber}
                    </p>
                  )}
                </div>

                {booking.type === 'hostel' && (
                  <>
                    <div>
                      <h4 className="font-medium mb-2">Stay Duration</h4>
                      <p>
                        <strong>Check-in:</strong> {formatDate(booking.stayDuration.checkInDate)}
                      </p>
                      <p>
                        <strong>Check-out:</strong> {formatDate(booking.stayDuration.checkOutDate)}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Guests</h4>
                      <p>
                        <strong>Adults:</strong> {booking.guestDetails.adults}
                      </p>
                      <p>
                        <strong>Children:</strong> {booking.guestDetails.children}
                      </p>
                    </div>
                  </>
                )}

                {booking.type === 'auditorium' && (
                  <>
                    <div>
                      <h4 className="font-medium mb-2">Event Details</h4>
                      <p>
                        <strong>Event:</strong> {booking.eventDetails.eventName}
                      </p>
                      <p>
                        <strong>Date:</strong> {formatDate(booking.eventDetails.eventDate)}
                      </p>
                      <p>
                        <strong>Time:</strong> {booking.eventDetails.eventTime} -{' '}
                        {booking.eventDetails.eventEndTime}
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <h4 className="font-medium mb-2">Booking Status</h4>
                  <Badge variant={booking.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                    {booking.paymentStatus}
                  </Badge>
                  {booking.price && (
                    <p className="mt-1">
                      <strong>Price:</strong> ${booking.price}
                    </p>
                  )}
                </div>
              </div>

              {whatsappResult && (
                <div className="mt-4 p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    {whatsappResult.includes('✅') ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={whatsappResult.includes('✅') ? 'text-green-700' : 'text-red-700'}
                    >
                      {whatsappResult}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
