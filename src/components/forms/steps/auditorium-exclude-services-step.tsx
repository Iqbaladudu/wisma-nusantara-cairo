'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { 
  Settings, 
  AirVent, 
  Armchair, 
  Monitor, 
  Table, 
  Utensils, 
  Coffee,
  Info
} from 'lucide-react'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AuditoriumBookingFormData } from '@/lib/schemas'
import { calculateExcludeServicesPrice } from '@/lib/api'

interface AuditoriumExcludeServicesStepProps {
  form: UseFormReturn<AuditoriumBookingFormData>
}

export function AuditoriumExcludeServicesStep({ form }: AuditoriumExcludeServicesStepProps) {
  const watchedValues = form.watch()
  
  // Calculate exclude services pricing
  const excludeServicesPricing = calculateExcludeServicesPrice(watchedValues.excludeServices)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Layanan Tambahan
          </CardTitle>
          <CardDescription>
            Pilih layanan tambahan yang Anda butuhkan untuk acara Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Important Notice */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Catatan Penting:</strong> Penyewaan layanan tambahan hanya tersedia dalam paket yang disebutkan, tidak tersedia dalam satuan.
            </AlertDescription>
          </Alert>

          {/* Air Conditioner */}
          <FormField
            control={form.control}
            name="excludeServices.airConditioner"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <AirVent className="h-4 w-4" />
                  Air Conditioner (AC)
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Pilih paket AC" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Tidak menggunakan AC</SelectItem>
                    <SelectItem value="4-6_hours">4 - 6 Jam: 100 EGP</SelectItem>
                    <SelectItem value="7-9_hours">7 - 9 Jam: 150 EGP</SelectItem>
                    <SelectItem value="9-12_hours">9 - 12 Jam: 250 EGP</SelectItem>
                    <SelectItem value="12-14_hours">12 - 14 Jam: 300 EGP</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Pilih paket AC sesuai dengan durasi acara Anda
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Extra Chairs */}
          <FormField
            control={form.control}
            name="excludeServices.extraChairs"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Armchair className="h-4 w-4" />
                  Kursi Ekstra
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Pilih jumlah kursi" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Tidak membutuhkan</SelectItem>
                    <SelectItem value="3_chairs">3 kursi: 75 EGP</SelectItem>
                    <SelectItem value="5_chairs">5 kursi: 120 EGP</SelectItem>
                    <SelectItem value="7_chairs">7 kursi: 160 EGP</SelectItem>
                    <SelectItem value="10_chairs">10 kursi: 210 EGP</SelectItem>
                    <SelectItem value="15_chairs">15 kursi: 300 EGP</SelectItem>
                    <SelectItem value="20_chairs">20 kursi: 380 EGP</SelectItem>
                    <SelectItem value="30_chairs">30 kursi: 540 EGP</SelectItem>
                    <SelectItem value="40_chairs">40 kursi: 680 EGP</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Tambahan kursi untuk tamu ekstra
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Projector */}
          <FormField
            control={form.control}
            name="excludeServices.projector"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Proyektor
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Pilih paket proyektor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Tidak membutuhkan proyektor</SelectItem>
                    <SelectItem value="projector_only">Proyektor saja: 250 EGP</SelectItem>
                    <SelectItem value="screen_only">Layar saja: 75 EGP</SelectItem>
                    <SelectItem value="projector_and_screen">Proyektor dan Layar: 275 EGP</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  <strong>BenQ GV30:</strong> Resolusi tinggi 720p, desain portable, koneksi kabel & nirkabel, speaker terintegrasi
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Extra Tables */}
          <FormField
            control={form.control}
            name="excludeServices.extraTables"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  Meja Tambahan
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Pilih jumlah meja" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Tidak membutuhkan meja</SelectItem>
                    <SelectItem value="3_tables">3 meja: 140 EGP</SelectItem>
                    <SelectItem value="6_tables">6 meja: 240 EGP</SelectItem>
                    <SelectItem value="9_tables">9 meja: 300 EGP</SelectItem>
                    <SelectItem value="more_than_9">Lebih dari 9 meja: Tanya ketersediaan</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Meja tambahan untuk keperluan acara
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Plates */}
          <FormField
            control={form.control}
            name="excludeServices.plates"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Piring
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Pilih jumlah piring" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Tidak membutuhkan</SelectItem>
                    <SelectItem value="6_plates">6 piring: 60 EGP</SelectItem>
                    <SelectItem value="12_plates">12 piring: 110 EGP</SelectItem>
                    <SelectItem value="18_plates">18 piring: 160 EGP</SelectItem>
                    <SelectItem value="24_plates">24 piring: 200 EGP</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Piring untuk keperluan makan
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Glasses */}
          <FormField
            control={form.control}
            name="excludeServices.glasses"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  Gelas
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Pilih jumlah gelas" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Tidak membutuhkan gelas</SelectItem>
                    <SelectItem value="3_glasses">3 gelas: 20 EGP</SelectItem>
                    <SelectItem value="6_glasses">6 gelas: 35 EGP</SelectItem>
                    <SelectItem value="12_glasses">12 gelas: 60 EGP</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Gelas untuk keperluan minum
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Pricing Summary */}
      {excludeServicesPricing.totalPrice > 0 && (
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Total Layanan Tambahan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Badge variant="outline" className="mb-2 text-xl px-4 py-2 border-blue-300">
                {excludeServicesPricing.totalPrice} EGP
              </Badge>
              <p className="text-sm text-blue-700 dark:text-blue-300">Total Biaya Layanan Tambahan</p>
            </div>
            
            <div className="bg-white dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Rincian Layanan:</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                {excludeServicesPricing.breakdown.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
