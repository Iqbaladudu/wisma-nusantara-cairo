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
  Edit,
  Calculator,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { AuditoriumBookingFormData } from '@/lib/schemas'
import { calculateAuditoriumPrice, calculateExcludeServicesPrice } from '@/lib/api'

interface AuditoriumBookingSummaryStepProps {
  form: UseFormReturn<AuditoriumBookingFormData>
  onEdit: (step: number) => void
}

export function AuditoriumBookingSummaryStep({ form, onEdit }: AuditoriumBookingSummaryStepProps) {
  const formData = form.getValues()

  // Calculate pricing
  const basePricing = calculateAuditoriumPrice(
    formData.eventDetails?.eventTime || '',
    formData.eventDetails?.eventEndTime || '',
  )

  const excludeServicesPricing = calculateExcludeServicesPrice(formData.excludeServices)
  const totalPrice = basePricing.totalPrice + excludeServicesPricing.totalPrice

  const summaryItems = [
    {
      title: 'Informasi Personal',
      step: 1,
      items: [
        { label: 'Nama Lengkap', value: formData.fullName, icon: <User className="h-4 w-4" /> },
        {
          label: 'Asal Negara',
          value: formData.countryOfOrigin,
          icon: <Globe className="h-4 w-4" />,
        },
      ],
    },
    {
      title: 'Detail Acara',
      step: 2,
      items: [
        {
          label: 'Nama Acara',
          value: formData.eventDetails?.eventName,
          icon: <FileText className="h-4 w-4" />,
        },
        {
          label: 'Tanggal Acara',
          value: formData.eventDetails?.eventDate
            ? format(formData.eventDetails.eventDate, 'EEEE, dd MMMM yyyy', { locale: id })
            : '-',
          icon: <Calendar className="h-4 w-4" />,
        },
        {
          label: 'Waktu Mulai',
          value: formData.eventDetails?.eventTime || '-',
          icon: <Clock className="h-4 w-4" />,
        },
        {
          label: 'Waktu Selesai',
          value: formData.eventDetails?.eventEndTime || '-',
          icon: <Clock className="h-4 w-4" />,
        },
      ],
    },
    {
      title: 'Informasi Kontak',
      step: 3,
      items: [
        {
          label: 'Nomor Telepon (Egypt)',
          value: formData.contactInfo?.egyptPhoneNumber,
          icon: <Phone className="h-4 w-4" />,
        },
        {
          label: 'Nomor WhatsApp',
          value: formData.contactInfo?.whatsappNumber,
          icon: <MessageCircle className="h-4 w-4" />,
        },
      ],
    },
    {
      title: 'Informasi Tambahan',
      step: 4,
      items: [
        {
          label: 'Kode Coupon',
          value: formData.couponCode || 'Tidak ada',
          icon: <Tag className="h-4 w-4" />,
        },
        {
          label: 'Catatan Acara',
          value: formData.eventNotes || 'Tidak ada catatan khusus',
          icon: <FileText className="h-4 w-4" />,
        },
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

              {sectionIndex < summaryItems.length - 1 && <Separator className="my-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Informasi Harga
          </CardTitle>
          <CardDescription>
            Perhitungan biaya berdasarkan durasi penggunaan auditorium
          </CardDescription>
        </CardHeader>
        <CardContent>
          {basePricing.totalHours > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <Badge variant="secondary" className="mb-2 text-lg px-3 py-1">
                    {basePricing.totalHours} Jam
                  </Badge>
                  <p className="text-sm text-green-700 dark:text-green-300">Durasi Acara</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Badge variant="outline" className="mb-2 text-lg px-3 py-1 border-blue-300">
                    {basePricing.totalPrice} EGP
                  </Badge>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Biaya Dasar</p>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <Badge variant="outline" className="mb-2 text-lg px-3 py-1 border-orange-300">
                    {excludeServicesPricing.totalPrice} EGP
                  </Badge>
                  <p className="text-sm text-orange-700 dark:text-orange-300">Layanan Tambahan</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <Badge variant="secondary" className="mb-2 text-xl px-3 py-1 font-bold">
                    {totalPrice} EGP
                  </Badge>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Total Biaya</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Rincian Paket Auditorium:
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {basePricing.priceBreakdown}
                  </p>
                </div>

                {excludeServicesPricing.totalPrice > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                    <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
                      Rincian Layanan Tambahan:
                    </h4>
                    <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                      {excludeServicesPricing.breakdown.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>
                  <strong>Paket Auditorium Tersedia:</strong>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  <span>• 1 Jam: 115 EGP</span>
                  <span>• 4 Jam: 420 EGP</span>
                  <span>• 9 Jam: 900 EGP</span>
                  <span>• 12 Jam: 1100 EGP</span>
                  <span>• 14 Jam: 1250 EGP</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  <p className="font-medium mb-2">Informasi Harga:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Lengkapi waktu mulai dan selesai untuk melihat estimasi harga</li>
                    <li>• Perhitungan berdasarkan paket durasi yang tersedia</li>
                    <li>• Diskon coupon akan diterapkan jika kode valid</li>
                    <li>• Invoice akan dikirim melalui WhatsApp</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Syarat dan Ketentuan / Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            {/* Operating Hours */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 text-lg">🕙</span>
              <div className="space-y-1">
                <p className="font-medium">
                  Jam operasional kami dari pukul 08.00 - 22.00, penyewaan diluar jam operasional
                  akan dikenakan biaya tambahan sebesar 125 EGP (diluar biaya sewa)
                </p>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  Operating hours are from 08:00 to 22:00. There is an additional charge of 125 EGP
                  (plus rental fees) for rentals outside these hours.
                </p>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 text-lg">📅</span>
              <div className="space-y-1">
                <p className="font-medium">
                  Jika melakukan pembatalan, akan dikenakan biaya pembatalan dari waktu yang akan
                  disewakan, berikut rinciannya:
                </p>
                <ul className="ml-4 space-y-1">
                  <li>📅 H - 1: 40% dari waktu yang akan digunakan</li>
                  <li>📅 Hari H: 50% dari waktu yang akan digunakan</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  In case of cancellation, a cancellation fee will be imposed depending on the time
                  to be used as follows:
                </p>
                <ul className="ml-4 space-y-1 text-gray-600 dark:text-gray-400 italic">
                  <li>📅 One day prior: 40% of the intended time</li>
                  <li>📅 Day of or after: 50% of the intended time</li>
                </ul>
              </div>
            </div>

            {/* Cleanliness Policy */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 text-lg">🧹</span>
              <div className="space-y-1">
                <p className="font-medium">
                  Bersedia menjaga kebersihan auditorium wisma nusantara dan sekitarnya.
                </p>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  Willing to maintain the cleanliness of the Wisma Nusantara auditorium and its
                  surroundings.
                </p>
                <p className="font-medium text-red-600 dark:text-red-400">
                  Akan dikenakan biaya kebersihan sebesar 150 EGP jika meninggalkan area wisma
                  nusantara dalam keadaan kotor.
                </p>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  A cleaning fee of 150 EGP will be charged if leaving the Auditorium area dirty.
                </p>
              </div>
            </div>

            {/* Wall Attachment Policy */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 text-lg">⚠️</span>
              <div className="space-y-1">
                <p className="font-medium">
                  Tidak menempel/memasang sesuatu pada dinding auditorium, seperti solatip, lakban,
                  lem, paku dan aksesoris lain TANPA SEIZIN staff, dan bersedia dikenakan denda jika
                  melanggar.
                </p>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  Not to attach/install anything on the auditorium walls such as adhesive tape,
                  masking tape, glue, nails, and other accessories without staff permission, and
                  willing to be fined if violated.
                </p>
              </div>
            </div>

            {/* Smoking Policy */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 text-lg">🚭</span>
              <div className="space-y-1">
                <p className="font-medium">Kebijakan Merokok:</p>
                <ul className="ml-4 space-y-1">
                  <li>⚠️ Seluruh area Wisma Nusantara adalah area dilarang merokok.</li>
                  <li>
                    ⚠️ Bersedia membayar Biaya tambahan sebesar EGP 100/ Orang untuk tamu yang
                    melanggar kebijakan merokok.
                  </li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 italic font-medium">
                  Smoking Policy:
                </p>
                <ul className="ml-4 space-y-1 text-gray-600 dark:text-gray-400 italic">
                  <li>⚠️ Smoking is prohibited in all areas of Wisma Nusantara.</li>
                  <li>
                    ⚠️ Guests who violate the smoking policy are subject to an additional fee of EGP
                    100 per person.
                  </li>
                </ul>
              </div>
            </div>

            {/* Damage Compensation */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 text-lg">🛠️</span>
              <div className="space-y-1">
                <p className="font-medium">
                  Bersedia ganti rugi jika merusak/menghilangkan fasilitas wisma nusantara.
                </p>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  Willing to compensate for any damage/loss of Wisma Nusantara facilities.
                </p>
              </div>
            </div>

            {/* Force Majeure */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
              <div className="space-y-1">
                <p className="font-medium">
                  Jika terjadi keadaan tak terduga di luar kendali, Wisma Nusantara tidak
                  bertanggung jawab atas kegagalan memenuhi kewajibannya.
                </p>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  Wisma Nusantara is not responsible for failing to meet its obligations in the
                  event of unforeseen circumstances beyond its control.
                </p>
              </div>
            </div>

            {/* Terms Amendment */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
              <div className="space-y-1">
                <p className="font-medium">
                  Wisma Nusantara berhak untuk mengubah syarat dan ketentuan ini tanpa pemberitahuan
                  sebelumnya.
                </p>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  Wisma Nusantara reserves the right to change these terms and conditions without
                  prior notice.
                </p>
              </div>
            </div>

            {/* Additional Terms */}
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
              <div className="space-y-2 text-sm">
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
                  <p>Fasilitas teknis tersedia sesuai kebutuhan dan ketersediaan</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms of Service Agreement */}
      <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-amber-900 dark:text-amber-100">
            <FileCheck className="h-5 w-5 text-amber-600" />
            Persetujuan Syarat dan Ketentuan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-amber-300 p-4 bg-white dark:bg-amber-950/50">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium text-amber-900 dark:text-amber-100 cursor-pointer">
                    Saya telah membaca dan menyetujui semua syarat dan ketentuan di atas
                  </FormLabel>
                  <FormMessage className="text-red-600 dark:text-red-400" />
                </div>
              </FormItem>
            )}
          />
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
              Pastikan semua informasi sudah benar. Setelah dikirim, Anda akan menerima konfirmasi
              melalui WhatsApp dalam waktu 24 jam.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
