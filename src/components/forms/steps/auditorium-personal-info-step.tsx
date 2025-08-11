'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { User, Globe } from 'lucide-react'

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
import { AuditoriumBookingFormData } from '@/lib/schemas'
import { useTranslations } from 'next-intl'

interface AuditoriumPersonalInfoStepProps {
  form: UseFormReturn<AuditoriumBookingFormData>
}

export function AuditoriumPersonalInfoStep({ form }: AuditoriumPersonalInfoStepProps) {
  const t = useTranslations('auditorium.personal')
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('title')}
          </CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                  <Input placeholder={t('fullName.placeholder')} {...field} className="h-12" />
                </FormControl>
                <FormDescription>{t('fullName.description')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="countryOfOrigin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t('countryOfOrigin.label')}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('countryOfOrigin.placeholder')}
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormDescription>{t('countryOfOrigin.description')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">{t('info.title')}</p>
            <ul className="space-y-1 text-xs">
              <li>• {t('info.lines.0')}</li>
              <li>• {t('info.lines.1')}</li>
              <li>• {t('info.lines.2')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
