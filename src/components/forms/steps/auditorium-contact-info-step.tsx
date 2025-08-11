'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Phone, MessageCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { PhoneFormField, PHONE_CONFIGS } from '@/components/ui/phone-form-field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuditoriumBookingFormData } from '@/lib/schemas'

interface AuditoriumContactInfoStepProps {
  form: UseFormReturn<AuditoriumBookingFormData>
}

export function AuditoriumContactInfoStep({ form }: AuditoriumContactInfoStepProps) {
  const t = useTranslations('auditorium.contact')
  const tCards = useTranslations('auditorium.contact.cards')
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            {t('title')}
          </CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PhoneFormField
            control={form.control}
            name="contactInfo.egyptPhoneNumber"
            label={(() => {
              try {
                return t('egyptPhone.label')
              } catch {
                return ''
              }
            })()}
            description={(() => {
              try {
                return t('egyptPhone.desc')
              } catch {
                return ''
              }
            })()}
            placeholder={(() => {
              try {
                return t('egyptPhone.placeholder')
              } catch {
                return ''
              }
            })()}
            icon={<Phone className="h-4 w-4" />}
            {...PHONE_CONFIGS.EGYPT_FOCUSED}
          />

          <PhoneFormField
            control={form.control}
            name="contactInfo.whatsappNumber"
            label={(() => {
              try {
                return t('whatsapp.label')
              } catch {
                return ''
              }
            })()}
            description={(() => {
              try {
                return t('whatsapp.desc')
              } catch {
                return ''
              }
            })()}
            placeholder={(() => {
              try {
                return t('whatsapp.placeholder')
              } catch {
                return ''
              }
            })()}
            icon={<MessageCircle className="h-4 w-4" />}
            {...PHONE_CONFIGS.ALL_COUNTRIES}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-700 dark:text-green-300">
              <p className="font-medium mb-1">
                {(() => {
                  try {
                    return tCards('egypt.title')
                  } catch {
                    return ''
                  }
                })()}
              </p>
              <ul className="space-y-1 text-xs">
                {(() => {
                  try {
                    return (tCards.raw('egypt.lines') as string[]).map((l, i) => (
                      <li key={i}>• {l}</li>
                    ))
                  } catch {
                    return null
                  }
                })()}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">
                {(() => {
                  try {
                    return tCards('wa.title')
                  } catch {
                    return 'WhatsApp'
                  }
                })()}
              </p>
              <ul className="space-y-1 text-xs">
                {(() => {
                  try {
                    return (tCards.raw('wa.lines') as string[]).map((l, i) => (
                      <li key={i}>• {l}</li>
                    ))
                  } catch {
                    return null
                  }
                })()}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div className="text-sm text-purple-700 dark:text-purple-300">
            <p className="font-medium mb-1">
              {(() => {
                try {
                  return tCards('info.title')
                } catch {
                  return ''
                }
              })()}
            </p>
            <ul className="space-y-1 text-xs">
              {(() => {
                try {
                  return (tCards.raw('info.lines') as string[]).map((l, i) => (
                    <li key={i}>• {l}</li>
                  ))
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
