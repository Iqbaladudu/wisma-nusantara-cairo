'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { HostelBookingFormData } from '@/lib/schemas'
import { calculateBookingPrice } from '@/lib/api'

interface StayDurationStepProps {
  form: UseFormReturn<HostelBookingFormData>
}

export function StayDurationStep({ form }: StayDurationStepProps) {
  const watchedValues = form.watch()
  
  // Calculate nights and pricing
  const checkInDate = watchedValues.stayDuration?.checkInDate
  const checkOutDate = watchedValues.stayDuration?.checkOutDate
  
  let nights = 1
  if (checkInDate && checkOutDate) {
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
    nights = Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  const pricing = calculateBookingPrice(watchedValues)

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Durasi Menginap
          </CardTitle>
          <CardDescription>
            Pilih tanggal check-in dan check-out Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Check-in Date */}
          <FormField
            control={form.control}
            name="stayDuration.checkInDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Tanggal Check-in
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal h-11',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: id })
                        ) : (
                          <span>Pilih tanggal check-in</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Check-in tersedia mulai pukul 14:00
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Check-out Date */}
          <FormField
            control={form.control}
            name="stayDuration.checkOutDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Tanggal Check-out
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal h-11',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP', { locale: id })
                        ) : (
                          <span>Pilih tanggal check-out</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const checkIn = watchedValues.stayDuration?.checkInDate
                        if (!checkIn) return false
                        return date <= checkIn
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Check-out sebelum pukul 12:00
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Duration Summary */}
      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Durasi Menginap
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {nights} malam
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {nights} {nights === 1 ? 'malam' : 'malam'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Preview */}
      {pricing.roomCost > 0 && (
        <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-green-900 dark:text-green-100">
              Estimasi Biaya Kamar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pricing.breakdown.singleBedCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-300">
                  Single Bed ({watchedValues.roomSelection?.singleBed} kamar × {nights} malam)
                </span>
                <span className="font-medium text-green-900 dark:text-green-100">
                  ${pricing.breakdown.singleBedCost}
                </span>
              </div>
            )}
            {pricing.breakdown.doubleBedCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-300">
                  Double Bed ({watchedValues.roomSelection?.doubleBed} kamar × {nights} malam)
                </span>
                <span className="font-medium text-green-900 dark:text-green-100">
                  ${pricing.breakdown.doubleBedCost}
                </span>
              </div>
            )}
            {pricing.breakdown.extraBedCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-300">
                  Extra Bed ({watchedValues.roomSelection?.extraBed} bed × {nights} malam)
                </span>
                <span className="font-medium text-green-900 dark:text-green-100">
                  ${pricing.breakdown.extraBedCost}
                </span>
              </div>
            )}
            <div className="border-t border-green-200 dark:border-green-800 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-900 dark:text-green-100">
                  Total Biaya Kamar
                </span>
                <span className="text-xl font-bold text-green-900 dark:text-green-100">
                  ${pricing.roomCost}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
              <CalendarIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                Informasi Check-in & Check-out
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Check-in: 14:00 - 23:00</li>
                <li>• Check-out: 07:00 - 12:00</li>
                <li>• Late check-in tersedia dengan pemberitahuan sebelumnya</li>
                <li>• Early check-in tergantung ketersediaan kamar</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
