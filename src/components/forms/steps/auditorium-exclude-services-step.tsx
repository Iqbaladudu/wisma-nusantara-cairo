'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Settings, AirVent, Armchair, Monitor, Table, Utensils, Coffee, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('auditorium.exclude')

  // Calculate exclude services pricing
  const excludeServicesPricing = calculateExcludeServicesPrice(watchedValues.excludeServices)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('title')}
          </CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Important Notice */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>{t('notice')}</AlertDescription>
          </Alert>

          {/* Air Conditioner */}
          <FormField
            control={form.control}
            name="excludeServices.airConditioner"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <AirVent className="h-4 w-4" />
                  {t('ac.label')}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('ac.placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">{t('ac.options.none')}</SelectItem>
                    <SelectItem value="4-6_hours">{t('ac.options.4-6_hours')}</SelectItem>
                    <SelectItem value="7-9_hours">{t('ac.options.7-9_hours')}</SelectItem>
                    <SelectItem value="9-12_hours">{t('ac.options.10-12_hours')}</SelectItem>
                    <SelectItem value="12-14_hours">{t('ac.options.13-14_hours')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{t('ac.desc')}</FormDescription>
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
                  {t('chairs.label')}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('chairs.placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">{t('chairs.options.none')}</SelectItem>
                    <SelectItem value="3_chairs">{t('chairs.options.3_chairs')}</SelectItem>
                    <SelectItem value="5_chairs">{t('chairs.options.5_chairs')}</SelectItem>
                    <SelectItem value="7_chairs">{t('chairs.options.7_chairs')}</SelectItem>
                    <SelectItem value="10_chairs">{t('chairs.options.10_chairs')}</SelectItem>
                    <SelectItem value="15_chairs">{t('chairs.options.15_chairs')}</SelectItem>
                    <SelectItem value="20_chairs">{t('chairs.options.20_chairs')}</SelectItem>
                    <SelectItem value="30_chairs">{t('chairs.options.30_chairs')}</SelectItem>
                    <SelectItem value="40_chairs">{t('chairs.options.40_chairs')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{t('chairs.desc')}</FormDescription>
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
                  {t('projector.label')}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('projector.placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">{t('projector.options.none')}</SelectItem>
                    <SelectItem value="projector_only">
                      {t('projector.options.projector_only')}
                    </SelectItem>
                    <SelectItem value="screen_only">
                      {t('projector.options.screen_only')}
                    </SelectItem>
                    <SelectItem value="projector_and_screen">
                      {t('projector.options.projector_and_screen')}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{t('projector.desc')}</FormDescription>
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
                  {t('tables.label')}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('tables.placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">{t('tables.options.none')}</SelectItem>
                    <SelectItem value="3_tables">{t('tables.options.3_tables')}</SelectItem>
                    <SelectItem value="6_tables">{t('tables.options.6_tables')}</SelectItem>
                    <SelectItem value="9_tables">{t('tables.options.9_tables')}</SelectItem>
                    <SelectItem value="more_than_9">{t('tables.options.more_than_9')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{t('tables.desc')}</FormDescription>
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
                  {t('plates.label')}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('plates.placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">{t('plates.options.none')}</SelectItem>
                    <SelectItem value="6_plates">{t('plates.options.6_plates')}</SelectItem>
                    <SelectItem value="12_plates">{t('plates.options.12_plates')}</SelectItem>
                    <SelectItem value="18_plates">{t('plates.options.18_plates')}</SelectItem>
                    <SelectItem value="24_plates">{t('plates.options.24_plates')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{t('plates.desc')}</FormDescription>
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
                  {t('glasses.label')}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('glasses.placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">{t('glasses.options.none')}</SelectItem>
                    <SelectItem value="3_glasses">{t('glasses.options.3_glasses')}</SelectItem>
                    <SelectItem value="6_glasses">{t('glasses.options.6_glasses')}</SelectItem>
                    <SelectItem value="12_glasses">{t('glasses.options.12_glasses')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>{t('glasses.desc')}</FormDescription>
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
              {t('total.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Badge variant="outline" className="mb-2 text-xl px-4 py-2 border-blue-300">
                {excludeServicesPricing.totalPrice} EGP
              </Badge>
              <p className="text-sm text-blue-700 dark:text-blue-300">{t('total.desc')}</p>
            </div>

            <div className="bg-white dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                {t('total.breakdown')}
              </h4>
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
