'use client'

import React from 'react'
import Link from 'next/link'
import { Building2, Bed, Calendar, ArrowRight } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BookingOption {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  features: string[]
  price: string
  available: boolean
}

const bookingOptions: BookingOption[] = [
  {
    title: 'Hostel Booking',
    description: 'Akomodasi nyaman untuk menginap di Wisma Nusantara Cairo',
    icon: <Bed className="h-6 w-6" />,
    href: '/hostel',
    features: ['Single & Double Bed', 'Airport Pickup*', 'Meal Options*', 'Long Stay Discount'],
    price: 'Mulai dari $30/malam',
    available: true,
  },
  {
    title: 'Auditorium Booking',
    description: 'Sewa auditorium modern untuk acara, seminar, dan konferensi',
    icon: <Building2 className="h-6 w-6" />,
    href: '/auditorium',
    features: ['Kapasitas 80-100 orang', 'Proyektor HD', 'Sound System', 'AC & Lighting'],
    price: 'Mulai dari 115 EGP/jam',
    available: true,
  },
  {
    title: 'Homestay',
    description: 'Akomodasi pribadi dengan suasana keluarga',
    icon: <Calendar className="h-6 w-6" />,
    href: '/homestay',
    features: ['Single & Double Bed', 'Airport Pickup*', 'Meal Options*', 'Long Stay Discount'],
    price: 'Mulai dari $20/malam',
    available: false, // Coming soon
  },
]

interface BookingOptionsSummaryProps {
  className?: string
  showTitle?: boolean
  compact?: boolean
}

export function BookingOptionsSummary({
  className,
  showTitle = true,
  compact = false,
}: BookingOptionsSummaryProps) {
  return (
    <div className={className}>
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pilihan Booking</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Pilih layanan yang sesuai dengan kebutuhan Anda di Wisma Nusantara Cairo
          </p>
        </div>
      )}

      <div
        className={`grid gap-6 ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}
      >
        {bookingOptions.map((option, index) => (
          <Card
            key={option.title}
            className={`relative transition-all duration-200 hover:shadow-lg ${
              !option.available ? 'opacity-75' : 'hover:-translate-y-1'
            }`}
          >
            {!option.available && (
              <div className="absolute top-4 right-4 z-10">
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                >
                  Coming Soon
                </Badge>
              </div>
            )}

            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">{option.icon}</div>
                <div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {option.price}
                  </p>
                </div>
              </div>
              <CardDescription className="text-base">{option.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                {option.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                {option.available ? (
                  <Link href={option.href}>
                    <Button className="w-full group">
                      Booking Sekarang
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full">
                    Segera Hadir
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!compact && (
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">?</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Butuh Bantuan Memilih?
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Tim kami siap membantu Anda memilih layanan yang tepat sesuai kebutuhan
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/contact">Hubungi Kami</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://wa.me/201234567890" target="_blank" rel="noopener noreferrer">
                    WhatsApp Support
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Export compact version
export function CompactBookingOptionsSummary(props: Omit<BookingOptionsSummaryProps, 'compact'>) {
  return <BookingOptionsSummary {...props} compact />
}
