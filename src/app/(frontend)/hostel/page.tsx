'use client'

import { MultistepHostelForm } from '@/components/forms/multistep-hostel-form'
import { LanguageSelectorModal } from '@/components/ui/language-selector-modal'

export default function HostelBookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <LanguageSelectorModal />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Booking Hostel</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Lengkapi formulir booking untuk menginap di Wisma Nusantara Cairo. Proses booking mudah
            dan cepat dalam beberapa langkah.
          </p>
        </div>

        {/* Multistep Form */}
        <MultistepHostelForm redirectToConfirmation={true} className="w-full" />

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
