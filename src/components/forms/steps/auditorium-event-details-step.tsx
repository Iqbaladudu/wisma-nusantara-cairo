'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Calendar, Clock, FileText, Calculator } from 'lucide-react'
import { format } from 'date-fns'
import { ar as dfnsAR, enUS as dfnsEN, id as dfnsID } from 'date-fns/locale'
import { useLocale, useTranslations } from 'next-intl'

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
  const locale = useLocale()
  const tEvent = useTranslations('auditorium.event')
  const tPricing = useTranslations('auditorium.event.pricing')
  const tNotes = useTranslations('auditorium.event.notes')
  const dfnsLocale = locale === 'id' ? dfnsID : locale === 'ar' ? dfnsAR : dfnsEN
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
            {tEvent('title')}
          </CardTitle>
          <CardDescription>{tEvent('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="eventDetails.eventName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {tEvent('eventName.label')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={tEvent('eventName.placeholder')}
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormDescription>{tEvent('eventName.description')}</FormDescription>
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
                    {tEvent('eventDate.label')}
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
                            format(field.value, 'PPP', { locale: dfnsLocale })
                          ) : (
                            <span>{tEvent('eventDate.placeholder')}</span>
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
                        locale={dfnsLocale}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>{tEvent('eventDate.description')}</FormDescription>
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
                    {tEvent('eventTime.label')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tEvent('eventTime.placeholder')}
                      {...field}
                      className="h-12"
                      type="time"
                    />
                  </FormControl>
                  <FormDescription>{tEvent('eventTime.description')}</FormDescription>
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
                    {tEvent('eventEndTime.label')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tEvent('eventEndTime.placeholder')}
                      {...field}
                      className="h-12"
                      type="time"
                    />
                  </FormControl>
                  <FormDescription>{tEvent('eventEndTime.description')}</FormDescription>
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
              {tPricing('title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Badge variant="secondary" className="mb-2 text-lg px-3 py-1">
                  {pricing.totalHours}
                </Badge>
                <p className="text-sm text-green-700 dark:text-green-300">{tPricing('duration')}</p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2 text-lg px-3 py-1 border-green-300">
                  {pricing.totalPrice} EGP
                </Badge>
                <p className="text-sm text-green-700 dark:text-green-300">{tPricing('total')}</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="mb-2 text-sm px-2 py-1">
                  {Math.round(pricing.totalPrice / pricing.totalHours)} EGP
                </Badge>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {tPricing('avgPerHour')}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                {tPricing('breakdownTitle')}
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">{pricing.priceBreakdown}</p>
            </div>

            <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
              <p>
                <strong>{tPricing('packagesTitle')}</strong>
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                {(() => {
                  try {
                    const items = tPricing.raw('packages') as string[]
                    return items.map((item, idx) => <span key={idx}>• {item}</span>)
                  } catch {
                    return null
                  }
                })()}
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
            <p className="font-medium mb-1">{tNotes('title')}</p>
            <ul className="space-y-1 text-xs">
              {(() => {
                try {
                  const lines = tNotes.raw('lines') as string[]
                  return lines.map((line, idx) => <li key={idx}>• {line}</li>)
                } catch {
                  return null
                }
              })()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
