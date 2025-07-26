'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Calendar, Clock, FileText, Calculator } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { AuditoriumBookingFormData } from '@/lib/schemas'
import { calculateAuditoriumPrice } from '@/lib/api'

interface AuditoriumEventDetailsStepProps {
  form: UseFormReturn<AuditoriumBookingFormData>
}

export function AuditoriumEventDetailsStep({ form }: AuditoriumEventDetailsStepProps) {
  const watchedValues = form.watch()

  // Calculate pricing based on start and end time
  const startTime = watchedValues.eventDetails?.eventTime
  const endTime = watchedValues.eventDetails?.eventEndTime
  const pricing = calculateAuditoriumPrice(startTime || '', endTime || '')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detail Acara
          </CardTitle>
          <CardDescription>
            Masukkan informasi detail tentang acara yang akan diselenggarakan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="eventDetails.eventName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Nama Acara
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Seminar Teknologi, Workshop Bisnis, Konferensi"
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormDescription>Nama atau judul acara yang akan diselenggarakan</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="eventDetails.eventDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Tanggal Acara
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'h-12 pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: id })
                          ) : (
                            <span>Pilih tanggal acara</span>
                          )}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today
                        }}
                        locale={id}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Pilih tanggal pelaksanaan acara (tidak boleh di masa lalu)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventDetails.eventTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Waktu Mulai
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: 09:00" {...field} className="h-12" type="time" />
                  </FormControl>
                  <FormDescription>Waktu mulai acara (format 24 jam: HH:MM)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventDetails.eventEndTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Waktu Selesai
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: 17:00" {...field} className="h-12" type="time" />
                  </FormControl>
                  <FormDescription>Waktu selesai acara (format 24 jam: HH:MM)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing Display */}
      {pricing.totalHours > 0 && (
        <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-green-900 dark:text-green-100 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Estimasi Biaya Sewa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Badge variant="secondary" className="mb-2 text-lg px-3 py-1">
                  {pricing.totalHours} Jam
                </Badge>
                <p className="text-sm text-green-700 dark:text-green-300">Durasi Acara</p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2 text-lg px-3 py-1 border-green-300">
                  {pricing.totalPrice} EGP
                </Badge>
                <p className="text-sm text-green-700 dark:text-green-300">Total Biaya</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="mb-2 text-sm px-2 py-1">
                  {Math.round(pricing.totalPrice / pricing.totalHours)} EGP/jam
                </Badge>
                <p className="text-sm text-green-700 dark:text-green-300">Rata-rata per Jam</p>
              </div>
            </div>

            <div className="bg-white dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                Rincian Paket:
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">{pricing.priceBreakdown}</p>
            </div>

            <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
              <p>
                <strong>Paket Tersedia:</strong>
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                <span>• 1 Jam: 115 EGP</span>
                <span>• 4 Jam: 420 EGP</span>
                <span>• 9 Jam: 900 EGP</span>
                <span>• 12 Jam: 1100 EGP</span>
                <span>• 14 Jam: 1250 EGP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div className="text-sm text-amber-700 dark:text-amber-300">
            <p className="font-medium mb-1">Catatan Penting:</p>
            <ul className="space-y-1 text-xs">
              <li>• Auditorium tersedia dari pukul 08:00 - 22:00</li>
              <li>• Booking minimal H-1 dari tanggal acara</li>
              <li>• Konfirmasi ketersediaan akan dikirim via WhatsApp</li>
              <li>• Durasi maksimal penggunaan adalah 8 jam per hari</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
