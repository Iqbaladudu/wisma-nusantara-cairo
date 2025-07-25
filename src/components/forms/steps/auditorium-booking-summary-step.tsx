'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { 
  FileCheck, 
  User, 
  Globe, 
  Calendar, 
  Clock, 
  Phone, 
  MessageCircle, 
  Tag, 
  FileText,
  Edit
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AuditoriumBookingFormData } from '@/lib/schemas'

interface AuditoriumBookingSummaryStepProps {
  form: UseFormReturn<AuditoriumBookingFormData>
  onEdit: (step: number) => void
}

export function AuditoriumBookingSummaryStep({ form, onEdit }: AuditoriumBookingSummaryStepProps) {
  const formData = form.getValues()

  const summaryItems = [
    {
      title: 'Informasi Personal',
      step: 1,
      items: [
        { label: 'Nama Lengkap', value: formData.fullName, icon: <User className="h-4 w-4" /> },
        { label: 'Asal Negara', value: formData.countryOfOrigin, icon: <Globe className="h-4 w-4" /> },
      ],
    },
    {
      title: 'Detail Acara',
      step: 2,
      items: [
        { label: 'Nama Acara', value: formData.eventDetails?.eventName, icon: <FileText className="h-4 w-4" /> },
        { 
          label: 'Tanggal Acara', 
          value: formData.eventDetails?.eventDate ? format(formData.eventDetails.eventDate, 'EEEE, dd MMMM yyyy', { locale: id }) : '-',
          icon: <Calendar className="h-4 w-4" />
        },
        { label: 'Waktu Acara', value: formData.eventDetails?.eventTime || '-', icon: <Clock className="h-4 w-4" /> },
      ],
    },
    {
      title: 'Informasi Kontak',
      step: 3,
      items: [
        { label: 'Nomor Telepon (Egypt)', value: formData.contactInfo?.egyptPhoneNumber, icon: <Phone className="h-4 w-4" /> },
        { label: 'Nomor WhatsApp', value: formData.contactInfo?.whatsappNumber, icon: <MessageCircle className="h-4 w-4" /> },
      ],
    },
    {
      title: 'Informasi Tambahan',
      step: 4,
      items: [
        { label: 'Kode Coupon', value: formData.couponCode || 'Tidak ada', icon: <Tag className="h-4 w-4" /> },
        { label: 'Catatan Acara', value: formData.eventNotes || 'Tidak ada catatan khusus', icon: <FileText className="h-4 w-4" /> },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Ringkasan Booking Auditorium
          </CardTitle>
          <CardDescription>
            Periksa kembali semua informasi sebelum mengirim booking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {summaryItems.map((section, sectionIndex) => (
            <div key={section.title} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {section.title}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(section.step)}
                  className="h-8 px-3"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-0.5 text-gray-500 dark:text-gray-400">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.label}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100 break-words">
                        {item.value || '-'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {sectionIndex < summaryItems.length - 1 && (
                <Separator className="my-6" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informasi Harga</CardTitle>
          <CardDescription>
            Harga akan dihitung berdasarkan durasi dan fasilitas yang digunakan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <p className="font-medium mb-2">Informasi Harga:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Harga akan dikonfirmasi setelah booking diterima</li>
                  <li>• Perhitungan berdasarkan durasi penggunaan dan fasilitas</li>
                  <li>• Diskon coupon akan diterapkan jika kode valid</li>
                  <li>• Invoice akan dikirim melalui WhatsApp</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Syarat dan Ketentuan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
              <p>Booking akan dikonfirmasi dalam waktu maksimal 24 jam setelah pengajuan</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
              <p>Pembayaran dilakukan setelah konfirmasi ketersediaan auditorium</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
              <p>Pembatalan dapat dilakukan maksimal H-2 sebelum tanggal acara</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
              <p>Fasilitas teknis tersedia sesuai kebutuhan dan ketersediaan</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
              <p>Pengguna bertanggung jawab atas kerusakan fasilitas selama acara</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">
            <p className="font-medium mb-1">Siap untuk mengirim booking?</p>
            <p className="text-xs">
              Pastikan semua informasi sudah benar. Setelah dikirim, Anda akan menerima 
              konfirmasi melalui WhatsApp dalam waktu 24 jam.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
