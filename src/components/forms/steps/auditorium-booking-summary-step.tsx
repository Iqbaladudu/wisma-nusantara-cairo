'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { format } from 'date-fns'
import { ar, enUS, id } from 'date-fns/locale'
import {
  FileCheck,
  User,
  Globe,
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  Tag,
  FileText,
  Edit,
  Calculator,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { AuditoriumBookingFormData } from '@/lib/schemas'
import { calculateAuditoriumPrice, calculateExcludeServicesPrice } from '@/lib/api'
import { useTranslations, useLocale } from 'next-intl'

interface AuditoriumBookingSummaryStepProps {
  form: UseFormReturn<AuditoriumBookingFormData>
  onEdit: (step: number) => void
}

export function AuditoriumBookingSummaryStep({ form, onEdit }: AuditoriumBookingSummaryStepProps) {
  const formData = form.getValues()
  const t = useTranslations('auditorium.summary')
  const tEvent = useTranslations('auditorium.event')
  const tExclude = useTranslations('auditorium.exclude')
  const locale = useLocale()
  const dateFnsLocale = locale === 'id' ? id : locale === 'ar' ? ar : enUS

  // Calculate pricing
  const basePricing = calculateAuditoriumPrice(
    formData.eventDetails?.eventTime || '',
    formData.eventDetails?.eventEndTime || '',
  )

  const excludeServicesPricing = calculateExcludeServicesPrice(formData.excludeServices)
  const totalPrice = basePricing.totalPrice + excludeServicesPricing.totalPrice

  const summaryItems = [
    {
      title: t('sections.personal'),
      step: 1,
      items: [
        {
          label: t('labels.fullName'),
          value: formData.fullName,
          icon: <User className="h-4 w-4" />,
        },
        {
          label: t('labels.country'),
          value: formData.countryOfOrigin,
          icon: <Globe className="h-4 w-4" />,
        },
      ],
    },
    {
      title: t('sections.event'),
      step: 2,
      items: [
        {
          label: t('labels.eventName'),
          value: formData.eventDetails?.eventName,
          icon: <FileText className="h-4 w-4" />,
        },
        {
          label: t('labels.eventDate'),
          value: formData.eventDetails?.eventDate
            ? format(formData.eventDetails.eventDate, 'EEEE, dd MMMM yyyy', {
                locale: dateFnsLocale,
              })
            : '-',
          icon: <Calendar className="h-4 w-4" />,
        },
        {
          label: t('labels.startTime'),
          value: formData.eventDetails?.eventTime || '-',
          icon: <Clock className="h-4 w-4" />,
        },
        {
          label: t('labels.endTime'),
          value: formData.eventDetails?.eventEndTime || '-',
          icon: <Clock className="h-4 w-4" />,
        },
      ],
    },
    {
      title: t('sections.contact'),
      step: 3,
      items: [
        {
          label: t('labels.egyptPhone'),
          value: formData.contactInfo?.egyptPhoneNumber,
          icon: <Phone className="h-4 w-4" />,
        },
        {
          label: t('labels.whatsapp'),
          value: formData.contactInfo?.whatsappNumber,
          icon: <MessageCircle className="h-4 w-4" />,
        },
      ],
    },
    {
      title: t('sections.additional'),
      step: 4,
      items: [
        {
          label: t('labels.coupon'),
          value: formData.couponCode || t('labels.none'),
          icon: <Tag className="h-4 w-4" />,
        },
        {
          label: t('labels.notes'),
          value: formData.eventNotes || t('labels.noNotes'),
          icon: <FileText className="h-4 w-4" />,
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            {t('header.title')}
          </CardTitle>
          <CardDescription>{t('header.desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {summaryItems.map((section, sectionIndex) => (
            <div key={section.title} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {section.title}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(section.step)}
                  className="h-8 px-3"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {t('edit')}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-0.5 text-gray-500 dark:text-gray-400">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.label}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100 break-words">
                        {item.value || '-'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {sectionIndex < summaryItems.length - 1 && <Separator className="my-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {t('sections.priceInfo')}
          </CardTitle>
          <CardDescription>{t('pricing.fillTimesInfo.title')}</CardDescription>
        </CardHeader>
        <CardContent>
          {basePricing.totalHours > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <Badge variant="secondary" className="mb-2 text-lg px-3 py-1">
                    {basePricing.totalHours}
                  </Badge>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {t('pricing.duration')}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Badge variant="outline" className="mb-2 text-lg px-3 py-1 border-blue-300">
                    {basePricing.totalPrice} EGP
                  </Badge>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{t('pricing.base')}</p>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <Badge variant="outline" className="mb-2 text-lg px-3 py-1 border-orange-300">
                    {excludeServicesPricing.totalPrice} EGP
                  </Badge>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    {t('pricing.extra')}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <Badge variant="secondary" className="mb-2 text-xl px-3 py-1 font-bold">
                    {totalPrice} EGP
                  </Badge>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    {t('pricing.total')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {tEvent('pricing.breakdownTitle')}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {basePricing.priceBreakdown}
                  </p>
                </div>

                {excludeServicesPricing.totalPrice > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                    <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
                      {tExclude('total.breakdown')}
                    </h4>
                    <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                      {excludeServicesPricing.breakdown.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>
                  <strong>{t('pricing.auditoriumPackagesTitle')}</strong>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  {(t.raw('pricing.auditoriumPackages') as string[]).map((line, idx) => (
                    <span key={idx}>• {line}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  <p className="font-medium mb-2">{t('pricing.fillTimesInfo.title')}</p>
                  <ul className="space-y-1 text-xs">
                    {(t.raw('pricing.fillTimesInfo.lines') as string[]).map((line, idx) => (
                      <li key={idx}>• {line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('terms.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="space-y-2">
              {/* Operating Hours */}
              <p>{(t.raw(`terms.opsHours.${locale}`) as string) || ''}</p>
              {/* Cancellation */}
              {(t.raw(`terms.cancel.${locale}`) as string[]).map((ln, i) => (
                <p key={`c-${i}`}>• {ln}</p>
              ))}
              {/* Cleanliness */}
              {(t.raw(`terms.clean.${locale}`) as string[]).map((ln, i) => (
                <p key={`cl-${i}`}>• {ln}</p>
              ))}
              {/* Walls */}
              {(t.raw(`terms.walls.${locale}`) as string[]).map((ln, i) => (
                <p key={`w-${i}`}>• {ln}</p>
              ))}
              {/* Smoking */}
              {(t.raw(`terms.smoking.${locale}`) as string[]).map((ln, i) => (
                <p key={`s-${i}`}>• {ln}</p>
              ))}
              {/* Damage */}
              {(t.raw(`terms.damage.${locale}`) as string[]).map((ln, i) => (
                <p key={`d-${i}`}>• {ln}</p>
              ))}
              {/* Force Majeure */}
              {(t.raw(`terms.forceMajeure.${locale}`) as string[]).map((ln, i) => (
                <p key={`f-${i}`}>• {ln}</p>
              ))}
              {/* Amendment */}
              {(t.raw(`terms.amendment.${locale}`) as string[]).map((ln, i) => (
                <p key={`a-${i}`}>• {ln}</p>
              ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
              <div className="space-y-2 text-sm">
                {(t.raw('terms.additional') as string[]).map((txt, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                    <p>{txt}</p>
                  </div>
                ))}
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
            {t('terms.agree.title')}
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
                    {t('terms.agree.label')}
                  </FormLabel>
                  <FormMessage className="text-red-600 dark:text-red-400" />
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">
            <p className="font-medium mb-1">{t('terms.ready.title')}</p>
            <p className="text-xs">{t('terms.ready.desc')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
