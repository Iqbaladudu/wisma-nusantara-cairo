'use client'

import React from 'react'
import { Building2, Users, Mic, Projector } from 'lucide-react'

import { FullAuditoriumBookingWidget } from '@/components/forms/auditorium-booking-widget'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AuditoriumBookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Booking Auditorium</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sewa auditorium modern dengan fasilitas lengkap untuk acara, seminar, konferensi, dan
            kegiatan lainnya di Wisma Nusantara Cairo.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg">Kapasitas Besar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dapat menampung hingga 200 orang dengan tata letak yang fleksibel
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Projector className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg">Fasilitas Modern</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Proyektor HD, sound system, AC, dan fasilitas teknis lainnya
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-lg">Audio Visual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sistem audio profesional dengan microphone wireless dan kabel
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informasi Harga & Fasilitas
            </CardTitle>
            <CardDescription>
              Harga sewa auditorium berdasarkan durasi dan fasilitas yang digunakan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Fasilitas Tersedia:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                    <span className="text-sm">Proyektor HD & Layar Besar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                    <span className="text-sm">Sound System Professional</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                    <span className="text-sm">Microphone Wireless & Kabel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                    <span className="text-sm">AC & Pencahayaan Optimal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                    <span className="text-sm">Kursi Auditorium (200 seat)</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Informasi Harga:</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>• Harga per jam: Mulai dari 500 EGP</p>
                  <p>• Paket half-day (4 jam): 1,800 EGP</p>
                  <p>• Paket full-day (8 jam): 3,200 EGP</p>
                  <p>• Setup & breakdown: Termasuk dalam harga</p>
                  <p>• Diskon tersedia untuk booking jangka panjang</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <FullAuditoriumBookingWidget
          redirectToConfirmation={true}
          className="mb-8"
          showHeader={false}
        />

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Butuh Bantuan?</CardTitle>
            <CardDescription>
              Hubungi tim kami untuk informasi lebih lanjut atau bantuan booking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium mb-1">WhatsApp:</p>
                <p className="text-gray-600 dark:text-gray-400">+20 123 456 7890</p>
              </div>
              <div>
                <p className="font-medium mb-1">Email:</p>
                <p className="text-gray-600 dark:text-gray-400">auditorium@wismanusantara.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
