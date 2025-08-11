'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Phone, MessageCircle, AlertCircle } from 'lucide-react'

import { PhoneFormField, PHONE_CONFIGS } from '@/components/ui/phone-form-field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HostelBookingFormData } from '@/lib/schemas'
import { useTranslations } from 'next-intl'

interface ContactInfoStepProps {
  form: UseFormReturn<HostelBookingFormData>
}

export function ContactInfoStep({ form }: ContactInfoStepProps) {
  const t = useTranslations('hostel.contact')
  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="h-5 w-5 text-primary" />
            {t('title')}
          </CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* WhatsApp Number */}
          <PhoneFormField
            control={form.control}
            name="contactInfo.whatsappNumber"
            label={t('whatsapp.label')}
            description={t('whatsapp.desc')}
            placeholder={t('whatsapp.placeholder')}
            icon={<MessageCircle className="h-4 w-4" />}
            {...PHONE_CONFIGS.ALL_COUNTRIES}
          />

          {/* Phone Number */}
          <PhoneFormField
            control={form.control}
            name="contactInfo.phoneNumber"
            label={t('phone.label')}
            description={t('phone.desc')}
            placeholder={t('phone.placeholder')}
            icon={<Phone className="h-4 w-4" />}
            {...PHONE_CONFIGS.ALL_COUNTRIES}
          />
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* WhatsApp Info */}
        <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  {t('cards.whatsapp.title')}
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {t('cards.whatsapp.lines.0')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phone Info */}
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  {t('cards.phone.title')}
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {t('cards.phone.lines.0')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notice */}
      <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                {t('cards.important.title')}
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                {t.raw('cards.important.lines').map((line: string, i: number) => (
                  <li key={i}>• {line}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Format Guide */}
      <Card className="bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{t('cards.guide.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <h5 className="font-medium mb-2">{t('cards.guide.features.title')}</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                {t.raw('cards.guide.features.lines').map((line: string, i: number) => (
                  <li key={i}>• {line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">{t('cards.guide.how.title')}</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                {t.raw('cards.guide.how.lines').map((line: string, i: number) => (
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
