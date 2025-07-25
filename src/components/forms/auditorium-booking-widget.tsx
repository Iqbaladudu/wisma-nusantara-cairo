'use client'

import React, { useState } from 'react'
import { Building2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

import { MultistepAuditoriumForm } from './multistep-auditorium-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AuditoriumBookingFormData } from '@/lib/schemas'

interface AuditoriumBookingWidgetProps {
  className?: string
  onBookingComplete?: (data: AuditoriumBookingFormData) => void
  showHeader?: boolean
  compact?: boolean
  redirectToConfirmation?: boolean
}

export function AuditoriumBookingWidget({
  className,
  onBookingComplete,
  showHeader = true,
  compact = false,
  redirectToConfirmation = false,
}: AuditoriumBookingWidgetProps) {
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [bookingData, setBookingData] = useState<AuditoriumBookingFormData | null>(null)

  const handleBookingSuccess = (data: AuditoriumBookingFormData) => {
    setBookingData(data)
    setBookingStatus('success')
    onBookingComplete?.(data)

    // Auto-reset after 5 seconds
    setTimeout(() => {
      setBookingStatus('idle')
      setBookingData(null)
    }, 5000)
  }

  const handleReset = () => {
    setBookingStatus('idle')
    setBookingData(null)
  }

  if (bookingStatus === 'success' && bookingData) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Booking Berhasil Dikirim!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Terima kasih {bookingData.fullName}, booking auditorium untuk acara "
                {bookingData.eventDetails.eventName}" telah berhasil dikirim.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Langkah Selanjutnya:</p>
                <ul className="text-xs space-y-1 text-left">
                  <li>• Konfirmasi akan dikirim dalam 24 jam</li>
                  <li>• Cek WhatsApp untuk update status</li>
                  <li>• Invoice akan dikirim setelah konfirmasi</li>
                </ul>
              </div>
            </div>

            <Button onClick={handleReset} variant="outline" className="w-full">
              Booking Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      {showHeader && !compact && (
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Booking Auditorium</CardTitle>
            <CardDescription className="text-base">
              Sewa auditorium modern dengan fasilitas lengkap untuk acara Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <Badge variant="secondary" className="mb-2">
                  200
                </Badge>
                <p className="text-xs text-gray-600 dark:text-gray-400">Kapasitas</p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">
                  HD
                </Badge>
                <p className="text-xs text-gray-600 dark:text-gray-400">Proyektor</p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">
                  Pro
                </Badge>
                <p className="text-xs text-gray-600 dark:text-gray-400">Audio</p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">
                  24/7
                </Badge>
                <p className="text-xs text-gray-600 dark:text-gray-400">AC</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <MultistepAuditoriumForm
        onSuccess={handleBookingSuccess}
        redirectToConfirmation={redirectToConfirmation}
        className={compact ? 'max-w-2xl' : 'max-w-4xl mx-auto'}
      />
    </div>
  )
}

// Export a compact version for embedding
export function CompactAuditoriumBookingWidget(
  props: Omit<AuditoriumBookingWidgetProps, 'compact'>,
) {
  return <AuditoriumBookingWidget {...props} compact showHeader={false} />
}

// Export a full-featured version
export function FullAuditoriumBookingWidget(props: AuditoriumBookingWidgetProps) {
  return <AuditoriumBookingWidget {...props} />
}
