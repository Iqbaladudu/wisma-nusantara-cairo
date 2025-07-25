'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Phone, MessageCircle, AlertCircle } from 'lucide-react'

import { PhoneFormField, PHONE_CONFIGS } from '@/components/ui/phone-form-field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HostelBookingFormData } from '@/lib/schemas'

interface ContactInfoStepProps {
  form: UseFormReturn<HostelBookingFormData>
}

export function ContactInfoStep({ form }: ContactInfoStepProps) {
  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="h-5 w-5 text-primary" />
            Informasi Kontak
          </CardTitle>
          <CardDescription>
            Masukkan nomor telepon dan WhatsApp untuk komunikasi booking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* WhatsApp Number */}
          <PhoneFormField
            control={form.control}
            name="contactInfo.whatsappNumber"
            label="Nomor WhatsApp"
            description="Nomor WhatsApp aktif untuk konfirmasi booking dan komunikasi"
            placeholder="Pilih negara dan masukkan nomor"
            icon={<MessageCircle className="h-4 w-4" />}
            {...PHONE_CONFIGS.ALL_COUNTRIES}
          />

          {/* Phone Number */}
          <PhoneFormField
            control={form.control}
            name="contactInfo.phoneNumber"
            label="Nomor Telepon"
            description="Nomor telepon yang dapat dihubungi (bisa sama dengan WhatsApp)"
            placeholder="Pilih negara dan masukkan nomor"
            icon={<Phone className="h-4 w-4" />}
            {...PHONE_CONFIGS.ALL_COUNTRIES}
          />
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* WhatsApp Info */}
        <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-green-900 dark:text-green-100">WhatsApp</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Konfirmasi booking dan update status akan dikirim melalui WhatsApp
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phone Info */}
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Telepon</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Untuk komunikasi darurat dan koordinasi check-in
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notice */}
      <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                Penting untuk Diperhatikan
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Pastikan nomor yang dimasukkan aktif dan dapat dihubungi</li>
                <li>• Konfirmasi booking akan dikirim dalam 24 jam</li>
                <li>• Jika tidak ada konfirmasi, silakan hubungi customer service</li>
                <li>• Nomor WhatsApp akan digunakan untuk koordinasi check-in</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Format Guide */}
      <Card className="bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Cara Menggunakan Input Nomor Telepon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <h5 className="font-medium mb-2">Fitur Modern:</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Dropdown dengan bendera semua negara</li>
                <li>• Search negara dengan nama atau kode</li>
                <li>• Auto-format nomor saat mengetik</li>
                <li>• Validasi format internasional</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">Cara Penggunaan:</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Klik dropdown untuk pilih negara</li>
                <li>• Ketik nama negara untuk search cepat</li>
                <li>• Masukkan nomor tanpa kode negara</li>
                <li>• Format otomatis ke standar internasional</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
