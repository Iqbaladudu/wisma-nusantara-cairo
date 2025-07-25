'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Calendar, Clock, FileText } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { AuditoriumBookingFormData } from '@/lib/schemas'

interface AuditoriumEventDetailsStepProps {
  form: UseFormReturn<AuditoriumBookingFormData>
}

export function AuditoriumEventDetailsStep({ form }: AuditoriumEventDetailsStepProps) {
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
                <FormDescription>
                  Nama atau judul acara yang akan diselenggarakan
                </FormDescription>
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
                            !field.value && 'text-muted-foreground'
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
                        initialFocus
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
                    Waktu Acara
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: 09:00, 14:30, 19:00"
                      {...field}
                      className="h-12"
                      type="time"
                    />
                  </FormControl>
                  <FormDescription>
                    Waktu mulai acara (format 24 jam: HH:MM)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

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
