'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import {
  User,
  MapPin,
  CreditCard,
  Bed,
  Calendar,
  Phone,
  MessageCircle,
  Car,
  UtensilsCrossed,
  Tag,
  Edit2,
  DollarSign,
  FileCheck,
} from 'lucide-react'
import { format } from 'date-fns'
import { ar as dfnsAR, enUS as dfnsEN, id as dfnsID } from 'date-fns/locale'
import { useLocale, useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { HostelBookingFormData } from '@/lib/schemas'
import { calculateBookingPrice } from '@/lib/api'

interface BookingSummaryStepProps {
  form: UseFormReturn<HostelBookingFormData>
  onEdit: (step: number) => void
}

export function BookingSummaryStep({ form, onEdit }: BookingSummaryStepProps) {
  const locale = useLocale()
  const t = useTranslations('hostel.summary')
  const tLabels = useTranslations('hostel.summary.labels')
  const tSections = useTranslations('hostel.summary.sections')
  const tPricing = useTranslations('hostel.summary.pricing')
  const tStay = useTranslations('hostel.stay')
  const tStayPricing = useTranslations('hostel.stay.pricing')
  const tMeals = useTranslations('hostel.services.meals')
  const tMealsOptions = useTranslations('hostel.services.meals.options')
  const tMealsFrequency = useTranslations('hostel.services.meals.frequency')
  const tPickup = useTranslations('hostel.services.pickup')
  const tPickupDetails = useTranslations('hostel.services.pickup.details')
  const tTerms = useTranslations('hostel.summary.terms')

  const formData = form.getValues()
  const pricing = calculateBookingPrice(formData)

  const dfnsLocale = locale === 'id' ? dfnsID : locale === 'ar' ? dfnsAR : dfnsEN

  // Helper function to format meal option names
  const formatMealOption = (option: string) => {
    try {
      return tMealsOptions(option)
    } catch {
      return option
    }
  }

  // Helper function to format frequency
  const formatFrequency = (frequency: string) => {
    try {
      return tMealsFrequency(frequency)
    } catch {
      return frequency
    }
  }

  // Helper function to format airport pickup
  const formatAirportPickup = (pickup: string) => {
    // keys used in form: 'none' | 'medium_vehicle' | 'hiace'
    const keyMap: Record<string, string> = {
      none: 'none.label',
      medium_vehicle: 'medium.label',
      hiace: 'hiace.label',
    }
    const k = keyMap[pickup]
    if (!k) return pickup
    try {
      return tPickup(k)
    } catch {
      return pickup
    }
  }

  // Helper to safely get terms arrays by section & language
  const getTermsLines = (section: string, lang?: string): string[] => {
    const path = lang ? `${section}.${lang}` : section
    try {
      const raw = tTerms.raw(path)
      return Array.isArray(raw) ? (raw as string[]) : typeof raw === 'string' ? [raw as string] : []
    } catch {
      return []
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t('header.title')}</h2>
        <p className="text-muted-foreground">{t('header.desc')}</p>
      </div>

      {/* Personal Information */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              {tSections('personal')}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(1)}
              className="text-primary hover:text-primary/80"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <User className="h-4 w-4" />
                {tLabels('fullName')}
              </div>
              <p className="font-medium">{formData.fullName}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <MapPin className="h-4 w-4" />
                {tLabels('country')}
              </div>
              <p className="font-medium">{formData.countryOfOrigin}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <CreditCard className="h-4 w-4" />
                {tLabels('passport')}
              </div>
              <p className="font-medium font-mono">{formData.passportNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Selection & Guests */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bed className="h-5 w-5 text-blue-500" />
              {tSections('roomGuests')}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(2)}
              className="text-blue-500 hover:text-blue-500/80"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-3">{tSections('roomGuests')}</h4>
              <div className="space-y-2">
                {formData.roomSelection.singleBed > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{tLabels('singleRoom')}</span>
                    <Badge variant="secondary">
                      {formData.roomSelection.singleBed} {tLabels('rooms')}
                    </Badge>
                  </div>
                )}
                {formData.roomSelection.doubleBed > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{tLabels('doubleRoom')}</span>
                    <Badge variant="secondary">
                      {formData.roomSelection.doubleBed} {tLabels('rooms')}
                    </Badge>
                  </div>
                )}
                {formData.roomSelection.extraBed > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{tLabels('extraBed')}</span>
                    <Badge variant="secondary">
                      {formData.roomSelection.extraBed} {tLabels('beds')}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">{tSections('roomGuests')}</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{tLabels('adults')}</span>
                  <Badge variant="secondary">
                    {formData.guestDetails.adults} {tLabels('people')}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{tLabels('children')}</span>
                  <Badge variant="secondary">
                    {formData.guestDetails.children} {tLabels('people')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stay Duration */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-green-500" />
              {tSections('stayDuration')}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(3)}
              className="text-green-500 hover:text-green-500/80"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1">{tLabels('checkIn')}</div>
              <p className="font-medium">
                {format(formData.stayDuration.checkInDate, 'PPP', { locale: dfnsLocale })}
              </p>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">{tLabels('checkOut')}</div>
              <p className="font-medium">
                {format(formData.stayDuration.checkOutDate, 'PPP', { locale: dfnsLocale })}
              </p>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">{tLabels('duration')}</div>
              <Badge variant="secondary" className="text-base px-3 py-1">
                {tStay('duration.nights', { count: pricing.breakdown.nights })}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5 text-purple-500" />
              {tSections('contact')}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(4)}
              className="text-purple-500 hover:text-purple-500/80"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <MessageCircle className="h-4 w-4" />
                {tLabels('whatsapp')}
              </div>
              <p className="font-medium font-mono">{formData.contactInfo.whatsappNumber}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Phone className="h-4 w-4" />
                {tLabels('phone')}
              </div>
              <p className="font-medium font-mono">{formData.contactInfo.phoneNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Services */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Car className="h-5 w-5 text-orange-500" />
              {tSections('services')}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(5)}
              className="text-orange-500 hover:text-orange-500/80"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Coupon Code */}
          {formData.couponCode && (
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Tag className="h-4 w-4" />
                {tSections('coupon')}
              </div>
              <Badge variant="outline" className="font-mono">
                {formData.couponCode}
              </Badge>
            </div>
          )}

          {/* Airport Pickup */}
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Car className="h-4 w-4" />
              {tSections('airportPickup')}
            </div>
            <p className="font-medium">{formatAirportPickup(formData.airportPickup)}</p>

            {formData.airportPickup !== 'none' && formData.departureDateTime?.departureDate && (
              <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-950 dark:border-orange-800">
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <span className="text-sm text-orange-700 dark:text-orange-300">
                      {tPickupDetails('date.label')}
                    </span>
                    <p className="font-medium text-orange-900 dark:text-orange-100">
                      {format(formData.departureDateTime.departureDate, 'PPP', {
                        locale: dfnsLocale,
                      })}
                    </p>
                  </div>
                  {formData.departureDateTime.departureTime && (
                    <div>
                      <span className="text-sm text-orange-700 dark:text-orange-300">
                        {tPickupDetails('time.label')}
                      </span>
                      <p className="font-medium text-orange-900 dark:text-orange-100">
                        {formData.departureDateTime.departureTime}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Meal Options */}
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <UtensilsCrossed className="h-4 w-4" />
              {tSections('mealPackage')}
            </div>

            <div className="space-y-3">
              {/* Breakfast */}
              {formData.mealOptions?.breakfastOption !== 'none' &&
                formData.mealOptions?.breakfastPortions &&
                formData.mealOptions.breakfastPortions > 0 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-950 dark:border-orange-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-orange-900 dark:text-orange-100">
                          {tMeals('breakfast.title')}:{' '}
                          {formatMealOption(formData.mealOptions.breakfastOption)}
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          {formData.mealOptions.breakfastPortions} {tMeals('portions')} •{' '}
                          {formatFrequency(
                            formData.mealOptions.breakfastFrequency || 'checkin_only',
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* Lunch */}
              {formData.mealOptions?.lunchOption !== 'none' &&
                formData.mealOptions?.lunchPortions &&
                formData.mealOptions.lunchPortions > 0 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-950 dark:border-orange-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-orange-900 dark:text-orange-100">
                          {tMeals('lunch.title')}:{' '}
                          {formatMealOption(formData.mealOptions.lunchOption)}
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          {formData.mealOptions.lunchPortions} {tMeals('portions')} •{' '}
                          {formatFrequency(formData.mealOptions.lunchFrequency || 'checkin_only')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* Dinner */}
              {formData.mealOptions?.dinnerOption !== 'none' &&
                formData.mealOptions?.dinnerPortions &&
                formData.mealOptions.dinnerPortions > 0 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-950 dark:border-orange-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-orange-900 dark:text-orange-100">
                          {tMeals('dinner.title')}:{' '}
                          {formatMealOption(formData.mealOptions.dinnerOption)}
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          {formData.mealOptions.dinnerPortions} {tMeals('portions')} •{' '}
                          {formatFrequency(formData.mealOptions.dinnerFrequency || 'checkin_only')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* No meals selected */}
              {(!formData.mealOptions?.breakfastOption ||
                formData.mealOptions.breakfastOption === 'none') &&
                (!formData.mealOptions?.lunchOption ||
                  formData.mealOptions.lunchOption === 'none') &&
                (!formData.mealOptions?.dinnerOption ||
                  formData.mealOptions.dinnerOption === 'none') && (
                  <p className="text-muted-foreground italic">{tSections('noMeals')}</p>
                )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Summary */}
      <Card className="border-l-4 border-l-green-600 bg-green-50 dark:bg-green-950">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-green-900 dark:text-green-100">
            <DollarSign className="h-5 w-5 text-green-600" />
            {tPricing('summary')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Room Costs */}
          <div className="space-y-3">
            <h4 className="font-medium text-green-900 dark:text-green-100">{tPricing('room')}</h4>

            {pricing.breakdown.singleBedCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-300">
                  {tStayPricing('single', {
                    rooms: formData.roomSelection.singleBed,
                    nights: pricing.breakdown.nights,
                  })}
                </span>
                <span className="font-medium text-green-900 dark:text-green-100">
                  ${pricing.breakdown.singleBedCost}
                </span>
              </div>
            )}

            {pricing.breakdown.doubleBedCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-300">
                  {tStayPricing('double', {
                    rooms: formData.roomSelection.doubleBed,
                    nights: pricing.breakdown.nights,
                  })}
                </span>
                <span className="font-medium text-green-900 dark:text-green-100">
                  ${pricing.breakdown.doubleBedCost}
                </span>
              </div>
            )}

            {pricing.breakdown.extraBedCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-300">
                  {tStayPricing('extra', {
                    beds: formData.roomSelection.extraBed,
                    nights: pricing.breakdown.nights,
                  })}
                </span>
                <span className="font-medium text-green-900 dark:text-green-100">
                  ${pricing.breakdown.extraBedCost}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-green-200 dark:border-green-800">
              <span className="font-medium text-green-900 dark:text-green-100">
                {tPricing('subtotalRoom')}
              </span>
              <span className="font-bold text-green-900 dark:text-green-100">
                ${pricing.roomCost}
              </span>
            </div>
          </div>

          {/* Additional Services Costs */}
          {pricing.additionalServicesCost > 0 && (
            <>
              <Separator className="bg-green-200 dark:bg-green-800" />
              <div className="space-y-3">
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  {tPricing('services')}
                </h4>

                {pricing.breakdown.airportPickupCost > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700 dark:text-green-300">
                      {tSections('airportPickup')}
                    </span>
                    <span className="font-medium text-green-900 dark:text-green-100">
                      ${pricing.breakdown.airportPickupCost}
                    </span>
                  </div>
                )}

                {pricing.breakdown.mealsCost > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700 dark:text-green-300">
                      {tSections('mealPackage')}
                    </span>
                    <span className="font-medium text-green-900 dark:text-green-100">
                      {pricing.breakdown.mealsCost} EGP
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-green-200 dark:border-green-800">
                  <span className="font-medium text-green-900 dark:text-green-100">
                    {tPricing('subtotalServices')}
                  </span>
                  <span className="font-bold text-green-900 dark:text-green-100">
                    ${pricing.breakdown.airportPickupCost} + {pricing.breakdown.mealsCost} EGP
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Total */}
          <Separator className="bg-green-200 dark:bg-green-800" />
          <div className="flex justify-between items-center pt-2">
            <span className="text-xl font-bold text-green-900 dark:text-green-100">
              {tPricing('total')}
            </span>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                ${pricing.roomCost + pricing.breakdown.airportPickupCost}
              </div>
              {pricing.breakdown.mealsCost > 0 && (
                <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                  + {pricing.breakdown.mealsCost} EGP
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{tTerms('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            {/* Check-in Time */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 text-lg">🕐</span>
              <div className="space-y-1">
                <ul className="ml-4 space-y-1">
                  {getTermsLines('checkInTime', locale).map((line, i) => (
                    <li key={`ci-${i}`}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Check-out Time */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 text-lg">🕛</span>
              <div className="space-y-1">
                <ul className="ml-4 space-y-1">
                  {getTermsLines('checkOutTime', locale).map((line, i) => (
                    <li key={`co-${i}`}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 text-lg">⚠️</span>
              <div className="space-y-1">
                <ul className="ml-4 space-y-1">
                  {getTermsLines('cancellation', locale).map((line, i) => (
                    <li key={`cancel-${i}`}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Smoking Policy */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 text-lg">🚭</span>
              <div className="space-y-1">
                <ul className="ml-4 space-y-1">
                  {getTermsLines('smoking', locale).map((line, i) => (
                    <li key={`smoke-${i}`}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Damage and Loss */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 text-lg">🛠️</span>
              <div className="space-y-1">
                <ul className="ml-4 space-y-1">
                  {getTermsLines('damage', locale).map((line, i) => (
                    <li key={`damage-${i}`}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Force Majeure */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
              <div className="space-y-1">
                <ul className="ml-4 space-y-1">
                  {getTermsLines('forceMajeure', locale).map((line, i) => (
                    <li key={`fm-${i}`}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Terms Amendment */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
              <div className="space-y-1">
                <ul className="ml-4 space-y-1">
                  {getTermsLines('amendment', locale).map((line, i) => (
                    <li key={`amend-${i}`}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Additional Terms */}
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
              <div className="space-y-2 text-sm">
                {(() => {
                  let lines: string[] = []
                  try {
                    const raw = tTerms.raw('additional')
                    lines = Array.isArray(raw) ? (raw as string[]) : []
                  } catch {
                    lines = []
                  }
                  return lines.map((line, i) => (
                    <div className="flex items-start gap-2" key={`add-${i}`}>
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                      <p>{line}</p>
                    </div>
                  ))
                })()}
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
            {(() => {
              try {
                return tTerms('agree.title')
              } catch {
                return tTerms('title')
              }
            })()}
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
                    {(() => {
                      try {
                        return tTerms('agree.label')
                      } catch {
                        return ''
                      }
                    })()}
                  </FormLabel>
                  <FormMessage className="text-red-600 dark:text-red-400" />
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  )
}
