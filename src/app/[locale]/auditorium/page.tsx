'use client'

import React from 'react'
import { Building2 } from 'lucide-react'

import { FullAuditoriumBookingWidget } from '@/components/forms/auditorium-booking-widget'
// Removed unused Card/Badge imports
import { LanguageSelectorModal } from '@/components/ui/language-selector-modal'

export default function AuditoriumBookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-end mb-4">
            <LanguageSelectorModal />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Booking Auditorium</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sewa auditorium modern dengan fasilitas lengkap untuk acara, seminar, konferensi, dan
            kegiatan lainnya di Wisma Nusantara Cairo.
          </p>
        </div>

        {/* Booking Form */}
        <FullAuditoriumBookingWidget
          redirectToConfirmation={true}
          className="mb-8"
          showHeader={false}
        />

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Butuh bantuan? Hubungi customer service kami di{' '}
            <a
              href="https://wa.me/1234567890"
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
