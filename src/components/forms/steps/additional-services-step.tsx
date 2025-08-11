'use client'

import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Car, UtensilsCrossed, Tag, Calendar, Clock, Plus, Minus } from 'lucide-react'
import { format } from 'date-fns'
import { id as dfnsID, ar as dfnsAR, enUS as dfnsEN } from 'date-fns/locale'

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { HostelBookingFormData } from '@/lib/schemas'
import { validateCoupon } from '@/lib/api'
import { useTranslations, useLocale } from 'next-intl'

interface AdditionalServicesStepProps {
  form: UseFormReturn<HostelBookingFormData>
}

export function AdditionalServicesStep({ form }: AdditionalServicesStepProps) {
  const tCoupon = useTranslations('hostel.services.coupon')
  const tPickup = useTranslations('hostel.services.pickup')
  const tMeals = useTranslations('hostel.services.meals')
  const locale = useLocale()
  const dfnsLocale = locale === 'id' ? dfnsID : locale === 'ar' ? dfnsAR : dfnsEN
  const [couponValidating, setCouponValidating] = useState(false)
  const [couponStatus, setCouponStatus] = useState<{
    valid: boolean
    message: string
    discount?: number
  } | null>(null)

  const watchedValues = form.watch()
  const airportPickup = watchedValues.airportPickup
  const showDepartureFields = airportPickup !== 'none'

  // Handle coupon validation
  const handleValidateCoupon = async () => {
    const couponCode = watchedValues.couponCode
    if (!couponCode?.trim()) {
      setCouponStatus(null)
      return
    }

    setCouponValidating(true)
    try {
      const result = await validateCoupon(couponCode.trim())
      setCouponStatus({
        valid: result.valid,
        discount: result.discount,
        message:
          result.message ??
          (result.valid
            ? tCoupon('validDiscount', { discount: result.discount ?? 0 })
            : tCoupon('error')),
      })
    } catch (_error) {
      setCouponStatus({
        valid: false,
        message: 'Error validating coupon',
      })
    } finally {
      setCouponValidating(false)
    }
  }

  // Helper function to update meal portions
  const updateMealPortions = (
    field: 'breakfastPortions' | 'lunchPortions' | 'dinnerPortions',
    increment: boolean,
  ) => {
    const currentValue = watchedValues.mealOptions?.[field] || 0
    const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1)

    form.setValue(`mealOptions.${field}`, newValue, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  return (
    <div className="space-y-6">
      {/* Coupon Code */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="h-5 w-5 text-primary" />
            {tCoupon('title')}
          </CardTitle>
          <CardDescription>{tCoupon('desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="couponCode"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder={tCoupon('placeholder')}
                      {...field}
                      className="h-11"
                      onChange={(e) => {
                        field.onChange(e.target.value.toUpperCase())
                        setCouponStatus(null)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleValidateCoupon}
              disabled={couponValidating || !watchedValues.couponCode?.trim()}
              className="h-11"
            >
              {couponValidating ? tCoupon('validating') : tCoupon('validate')}
            </Button>
          </div>

          {couponStatus && (
            <div
              className={`p-3 rounded-lg border ${
                couponStatus.valid
                  ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                  : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
              }`}
            >
              <p
                className={`text-sm ${
                  couponStatus.valid
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-red-700 dark:text-red-300'
                }`}
              >
                {couponStatus.valid
                  ? tCoupon('validDiscount', { discount: couponStatus.discount ?? 0 })
                  : tCoupon('error')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Airport Pickup */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Car className="h-5 w-5 text-blue-500" />
            {tPickup('title')}
          </CardTitle>
          <CardDescription>{tPickup('desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="airportPickup"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="none" id="none" />
                      <div className="flex-1">
                        <label htmlFor="none" className="font-medium cursor-pointer">
                          {tPickup('none.label')}
                        </label>
                        <p className="text-sm text-muted-foreground">{tPickup('none.desc')}</p>
                      </div>
                      <Badge variant="secondary">{tPickup('none.price')}</Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="medium_vehicle" id="medium" />
                      <div className="flex-1">
                        <label htmlFor="medium" className="font-medium cursor-pointer">
                          {tPickup('medium.label')}
                        </label>
                        <p className="text-sm text-muted-foreground">{tPickup('medium.desc')}</p>
                      </div>
                      <Badge variant="secondary">{tPickup('medium.price')}</Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="hiace" id="hiace" />
                      <div className="flex-1">
                        <label htmlFor="hiace" className="font-medium cursor-pointer">
                          {tPickup('hiace.label')}
                        </label>
                        <p className="text-sm text-muted-foreground">{tPickup('hiace.desc')}</p>
                      </div>
                      <Badge variant="secondary">{tPickup('hiace.price')}</Badge>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Departure Date & Time (conditional) */}
          {showDepartureFields && (
            <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                {tPickup('details.title')}
              </h4>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="departureDateTime.departureDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {tPickup('details.date.label')}
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP', { locale: dfnsLocale })
                              ) : (
                                <span>{tPickup('details.date.placeholder')}</span>
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
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departureDateTime.departureTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {tPickup('details.time.label')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tPickup('details.time.placeholder')}
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormDescription>{tPickup('details.time.desc')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meal Options */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UtensilsCrossed className="h-5 w-5 text-orange-500" />
            {tMeals('title')}
          </CardTitle>
          <CardDescription>{tMeals('desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Breakfast */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              {tMeals('breakfast.title')}
            </h4>

            <FormField
              control={form.control}
              name="mealOptions.breakfastOption"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={tMeals('breakfast.placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{tMeals('options.none')}</SelectItem>
                        <SelectItem value="nasi_goreng">
                          <div className="flex justify-between items-center w-full">
                            <span>{tMeals('options.nasi_goreng')}</span>
                            <Badge variant="secondary" className="ml-2">
                              {tMeals('options.prices.nasi_goreng')}
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="ayam_goreng">
                          <div className="flex justify-between items-center w-full">
                            <span>{tMeals('options.ayam_goreng')}</span>
                            <Badge variant="secondary" className="ml-2">
                              {tMeals('options.prices.ayam_goreng')}
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="nasi_kuning">
                          <div className="flex justify-between items-center w-full">
                            <span>{tMeals('options.nasi_kuning')}</span>
                            <Badge variant="secondary" className="ml-2">
                              {tMeals('options.prices.nasi_kuning')}
                            </Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedValues.mealOptions?.breakfastOption !== 'none' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{tMeals('portions')}</label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateMealPortions('breakfastPortions', false)}
                      disabled={(watchedValues.mealOptions?.breakfastPortions || 0) <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {watchedValues.mealOptions?.breakfastPortions || 0}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateMealPortions('breakfastPortions', true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="mealOptions.breakfastFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tMeals('frequency.label')}</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder={tMeals('frequency.placeholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="checkin_only">
                              {tMeals('frequency.checkin_only')}
                            </SelectItem>
                            <SelectItem value="during_stay">
                              {tMeals('frequency.during_stay')}
                            </SelectItem>
                            <SelectItem value="checkout_only">
                              {tMeals('frequency.checkout_only')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Lunch */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              {tMeals('lunch.title')}
            </h4>

            <FormField
              control={form.control}
              name="mealOptions.lunchOption"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={tMeals('lunch.placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{tMeals('options.none')}</SelectItem>
                        <SelectItem value="nasi_goreng">
                          <div className="flex justify-between items-center w-full">
                            <span>{tMeals('options.nasi_goreng')}</span>
                            <Badge variant="secondary" className="ml-2">
                              {tMeals('options.prices.nasi_goreng')}
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="ayam_goreng">
                          <div className="flex justify-between items-center w-full">
                            <span>{tMeals('options.ayam_goreng')}</span>
                            <Badge variant="secondary" className="ml-2">
                              {tMeals('options.prices.ayam_goreng')}
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="nasi_kuning">
                          <div className="flex justify-between items-center w-full">
                            <span>{tMeals('options.nasi_kuning')}</span>
                            <Badge variant="secondary" className="ml-2">
                              {tMeals('options.prices.nasi_kuning')}
                            </Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedValues.mealOptions?.lunchOption !== 'none' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{tMeals('portions')}</label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateMealPortions('lunchPortions', false)}
                      disabled={(watchedValues.mealOptions?.lunchPortions || 0) <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {watchedValues.mealOptions?.lunchPortions || 0}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateMealPortions('lunchPortions', true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="mealOptions.lunchFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tMeals('frequency.label')}</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder={tMeals('frequency.placeholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="checkin_only">
                              {tMeals('frequency.checkin_only')}
                            </SelectItem>
                            <SelectItem value="during_stay">
                              {tMeals('frequency.during_stay')}
                            </SelectItem>
                            <SelectItem value="checkout_only">
                              {tMeals('frequency.checkout_only')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Dinner */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              {tMeals('dinner.title')}
            </h4>

            <FormField
              control={form.control}
              name="mealOptions.dinnerOption"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={tMeals('dinner.placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{tMeals('options.none')}</SelectItem>
                        <SelectItem value="nasi_goreng">
                          <div className="flex justify-between items-center w-full">
                            <span>{tMeals('options.nasi_goreng')}</span>
                            <Badge variant="secondary" className="ml-2">
                              {tMeals('options.prices.nasi_goreng')}
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="ayam_goreng">
                          <div className="flex justify-between items-center w-full">
                            <span>{tMeals('options.ayam_goreng')}</span>
                            <Badge variant="secondary" className="ml-2">
                              {tMeals('options.prices.ayam_goreng')}
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="nasi_kuning">
                          <div className="flex justify-between items-center w-full">
                            <span>{tMeals('options.nasi_kuning')}</span>
                            <Badge variant="secondary" className="ml-2">
                              {tMeals('options.prices.nasi_kuning')}
                            </Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedValues.mealOptions?.dinnerOption !== 'none' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{tMeals('portions')}</label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateMealPortions('dinnerPortions', false)}
                      disabled={(watchedValues.mealOptions?.dinnerPortions || 0) <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {watchedValues.mealOptions?.dinnerPortions || 0}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateMealPortions('dinnerPortions', true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="mealOptions.dinnerFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tMeals('frequency.label')}</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder={tMeals('frequency.placeholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="checkin_only">
                              {tMeals('frequency.checkin_only')}
                            </SelectItem>
                            <SelectItem value="during_stay">
                              {tMeals('frequency.during_stay')}
                            </SelectItem>
                            <SelectItem value="checkout_only">
                              {tMeals('frequency.checkout_only')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900">
              <UtensilsCrossed className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-orange-900 dark:text-orange-100">
                {tMeals('info.title')}
              </h4>
              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                {tMeals.raw('info.lines').map((line: string, i: number) => (
                  <li key={i}>• {line}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
