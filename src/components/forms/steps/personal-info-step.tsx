'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { User, MapPin, CreditCard } from 'lucide-react'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HostelBookingFormData } from '@/lib/schemas'
import { useTranslations } from 'next-intl'

interface PersonalInfoStepProps {
  form: UseFormReturn<HostelBookingFormData>
}

export function PersonalInfoStep({ form }: PersonalInfoStepProps) {
  const t = useTranslations('hostel.personal')
  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            {t('title')}
          </CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t('fullName.label')}
                </FormLabel>
                <FormControl>
                  <Input placeholder={t('fullName.placeholder')} {...field} className="h-11" />
                </FormControl>
                <FormDescription>{t('fullName.description')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country of Origin */}
          <FormField
            control={form.control}
            name="countryOfOrigin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('countryOfOrigin.label')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('countryOfOrigin.placeholder')}
                    {...field}
                    className="h-11"
                  />
                </FormControl>
                <FormDescription>{t('countryOfOrigin.description')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Passport Number */}
          <FormField
            control={form.control}
            name="passportNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {t('passportNumber.label')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('passportNumber.placeholder')}
                    {...field}
                    className="h-11"
                    style={{ textTransform: 'uppercase' }}
                    onChange={(e) => {
                      field.onChange(e.target.value.toUpperCase())
                    }}
                  />
                </FormControl>
                <FormDescription>{t('passportNumber.description')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">{t('info.title')}</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {t('info.lines.0')}
                {t('info.lines.1')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
