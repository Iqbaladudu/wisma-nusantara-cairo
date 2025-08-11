'use client'

import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Tag, FileText, Check, X, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AuditoriumBookingFormData } from '@/lib/schemas'
import { validateCoupon } from '@/lib/api'

interface AuditoriumAdditionalInfoStepProps {
  form: UseFormReturn<AuditoriumBookingFormData>
}

export function AuditoriumAdditionalInfoStep({ form }: AuditoriumAdditionalInfoStepProps) {
  const t = useTranslations('auditorium.additional')
  const [couponStatus, setCouponStatus] = useState<{
    isValidating: boolean
    isValid: boolean | null
    message: string
    discount?: number
  }>({
    isValidating: false,
    isValid: null,
    message: '',
  })

  const handleValidateCoupon = async () => {
    const couponCode = form.getValues('couponCode')
    if (!couponCode?.trim()) {
      setCouponStatus({
        isValidating: false,
        isValid: false,
        message: t('coupon.enterFirst'),
      })
      return
    }

    setCouponStatus((prev) => ({ ...prev, isValidating: true }))

    try {
      const result = await validateCoupon(couponCode.trim())
      setCouponStatus({
        isValidating: false,
        isValid: result.valid,
        message: result.message || '',
        discount: result.discount,
      })
    } catch (_error) {
      setCouponStatus({
        isValidating: false,
        isValid: false,
        message: t('coupon.invalid'),
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('title')}
          </CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="couponCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  {t('coupon.label')}
                </FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder={t('coupon.placeholder')}
                      {...field}
                      className="h-12"
                      onChange={(e) => {
                        field.onChange(e)
                        // Reset coupon status when input changes
                        setCouponStatus({
                          isValidating: false,
                          isValid: null,
                          message: '',
                        })
                      }}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleValidateCoupon}
                    disabled={couponStatus.isValidating || !field.value?.trim()}
                    className="h-12 px-4"
                  >
                    {couponStatus.isValidating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t('coupon.validate')
                    )}
                  </Button>
                </div>

                {/* Coupon Status */}
                {couponStatus.message && (
                  <div className="flex items-center gap-2 mt-2">
                    {couponStatus.isValid === true && (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          {t('coupon.valid', { discount: couponStatus.discount ?? 0 })}
                        </Badge>
                      </>
                    )}
                    {couponStatus.isValid === false && (
                      <>
                        <X className="h-4 w-4 text-red-600" />
                        <Badge variant="destructive">
                          {couponStatus.message || t('coupon.invalidDefault')}
                        </Badge>
                      </>
                    )}
                  </div>
                )}

                {/* No extra coupon description in catalog */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eventNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t('notes.label')}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('notes.placeholder')}
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t('notes.desc')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center mt-0.5">
            <span className="text-white text-xs font-bold">?</span>
          </div>
          <div className="text-sm text-indigo-700 dark:text-indigo-300">
            <p className="font-medium mb-1">{t('tips.title')}</p>
            <ul className="space-y-1 text-xs">
              {(t.raw('tips.lines') as string[]).map((line, idx) => (
                <li key={idx}>• {line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
