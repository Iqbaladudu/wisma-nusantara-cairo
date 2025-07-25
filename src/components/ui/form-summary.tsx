'use client'

import * as React from 'react'
import {
  Edit2,
  Check,
  Calendar,
  Users,
  MapPin,
  Phone,
  CreditCard,
  FileText,
  Car,
  UtensilsCrossed,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimatedButton } from '@/components/ui/animated-button'
import { Separator } from '@/components/ui/separator'

export interface SummarySection {
  id: string
  title: string
  icon?: React.ReactNode
  items: SummaryItem[]
  onEdit?: () => void
  editable?: boolean
}

export interface SummaryItem {
  label: string
  value: string | number | Date | boolean | null | undefined
  type?: 'text' | 'date' | 'currency' | 'boolean' | 'list'
  format?: (value: any) => string
  highlight?: boolean
}

interface FormSummaryProps {
  sections: SummarySection[]
  title?: string
  subtitle?: string
  className?: string
  showEditButtons?: boolean
  variant?: 'default' | 'compact' | 'detailed'
}

export function FormSummary({
  sections,
  title = 'Review Your Information',
  subtitle = 'Please review all details before submitting',
  className,
  showEditButtons = true,
  variant = 'default',
}: FormSummaryProps) {
  const formatValue = (item: SummaryItem): string => {
    if (item.value === null || item.value === undefined || item.value === '') {
      return 'Not provided'
    }

    if (item.format) {
      return item.format(item.value)
    }

    switch (item.type) {
      case 'date':
        return item.value instanceof Date ? format(item.value, 'PPP') : String(item.value)
      case 'currency':
        return typeof item.value === 'number' ? `$${item.value.toFixed(2)}` : String(item.value)
      case 'boolean':
        return item.value ? 'Yes' : 'No'
      case 'list':
        return Array.isArray(item.value) ? item.value.join(', ') : String(item.value)
      default:
        return String(item.value)
    }
  }

  const getValueColor = (item: SummaryItem): string => {
    if (item.value === null || item.value === undefined || item.value === '') {
      return 'text-muted-foreground'
    }
    if (item.highlight) {
      return 'text-primary font-medium'
    }
    return 'text-foreground'
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-2 animate-fade-in">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>

      {/* Summary Sections */}
      <div className="space-y-4">
        {sections.map((section, sectionIndex) => (
          <Card
            key={section.id}
            className={cn(
              'hover-lift transition-all duration-300 animate-slide-up',
              variant === 'compact' && 'border-l-4 border-l-primary',
            )}
            style={{ animationDelay: `${sectionIndex * 100}ms` }}
          >
            <CardHeader className={cn('pb-3', variant === 'compact' && 'pb-2')}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {section.icon}
                  {section.title}
                </CardTitle>
                {showEditButtons && section.editable !== false && (
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    onClick={section.onEdit}
                    icon={<Edit2 className="h-3 w-3" />}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Edit
                  </AnimatedButton>
                )}
              </div>
            </CardHeader>

            <CardContent className={cn('space-y-3', variant === 'compact' && 'space-y-2')}>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-sm text-muted-foreground font-medium min-w-0 flex-1">
                      {item.label}
                    </span>
                    <span className={cn('text-sm text-right min-w-0 flex-1', getValueColor(item))}>
                      {formatValue(item)}
                    </span>
                  </div>
                  {itemIndex < section.items.length - 1 && variant === 'detailed' && (
                    <Separator className="mt-2" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confirmation */}
      <Card className="border-success bg-success/5 animate-fade-in">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-success">
            <div className="p-2 bg-success/10 rounded-full">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Ready to Submit</p>
              <p className="text-sm text-success/80">All required information has been provided</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to create common summary sections
export const createSummarySection = {
  personal: (data: any, onEdit?: () => void): SummarySection => ({
    id: 'personal',
    title: 'Personal Information',
    icon: <MapPin className="h-4 w-4" />,
    onEdit,
    items: [
      { label: 'Full Name', value: data.fullName, highlight: true },
      { label: 'Country of Origin', value: data.countryOfOrigin },
      { label: 'Passport Number', value: data.passportNumber },
    ],
  }),

  contact: (data: any, onEdit?: () => void): SummarySection => ({
    id: 'contact',
    title: 'Contact Information',
    icon: <Phone className="h-4 w-4" />,
    onEdit,
    items: [
      { label: 'WhatsApp Number', value: data.contactInfo?.whatsappNumber },
      { label: 'Phone Number', value: data.contactInfo?.phoneNumber },
    ],
  }),

  dates: (data: any, onEdit?: () => void): SummarySection => ({
    id: 'dates',
    title: 'Stay Duration',
    icon: <Calendar className="h-4 w-4" />,
    onEdit,
    items: [
      {
        label: 'Check-in Date',
        value: data.stayDuration?.checkInDate,
        type: 'date' as const,
        highlight: true,
      },
      {
        label: 'Check-out Date',
        value: data.stayDuration?.checkOutDate,
        type: 'date' as const,
        highlight: true,
      },
    ],
  }),

  guests: (data: any, onEdit?: () => void): SummarySection => ({
    id: 'guests',
    title: 'Guest Details',
    icon: <Users className="h-4 w-4" />,
    onEdit,
    items: [
      { label: 'Adults', value: data.guestDetails?.adults, highlight: true },
      { label: 'Children', value: data.guestDetails?.children },
    ],
  }),

  services: (data: any, onEdit?: () => void): SummarySection => {
    const airportPickupLabels = {
      none: 'No, thanks',
      medium_vehicle: 'Medium Private Vehicle (2-4 pax) - $35 USD',
      hiace: 'Hiace Van (up to 10 pax) - $50 USD',
    }

    const mealLabels = {
      none: 'No Thanks',
      nasi_goreng: 'Paket Nasi Goreng - 100 EGP/PAX',
      ayam_goreng: 'Paket Ayam Goreng - 120 EGP/PAX',
      nasi_kuning: 'Paket Nasi Kuning - 130 EGP/PAX',
    }

    const frequencyLabels = {
      checkin_only: 'Hanya saat check-in',
      during_stay: 'Selama menginap',
      checkout_only: 'Hanya saat akan check-out',
    }

    const items = []

    // Airport Pickup
    items.push({
      label: 'Airport Pickup',
      value:
        airportPickupLabels[data.airportPickup as keyof typeof airportPickupLabels] || 'No, thanks',
      highlight: data.airportPickup !== 'none',
    })

    if (data.airportPickup !== 'none' && data.departureDateTime?.departureDate) {
      items.push({
        label: 'Departure Date',
        value: data.departureDateTime.departureDate,
        type: 'date' as const,
      })
    }

    if (data.airportPickup !== 'none' && data.departureDateTime?.departureTime) {
      items.push({
        label: 'Departure Time',
        value: data.departureDateTime.departureTime,
      })
    }

    // Meal Options
    const mealOptions = data.mealOptions || {}

    if (mealOptions.breakfastOption && mealOptions.breakfastOption !== 'none') {
      items.push({
        label: 'Breakfast',
        value: `${mealLabels[mealOptions.breakfastOption as keyof typeof mealLabels]} (${mealOptions.breakfastPortions || 0} portions)`,
        highlight: true,
      })
      if (mealOptions.breakfastFrequency) {
        items.push({
          label: 'Breakfast Frequency',
          value: frequencyLabels[mealOptions.breakfastFrequency as keyof typeof frequencyLabels],
        })
      }
    }

    if (mealOptions.lunchOption && mealOptions.lunchOption !== 'none') {
      items.push({
        label: 'Lunch',
        value: `${mealLabels[mealOptions.lunchOption as keyof typeof mealLabels]} (${mealOptions.lunchPortions || 0} portions)`,
        highlight: true,
      })
      if (mealOptions.lunchFrequency) {
        items.push({
          label: 'Lunch Frequency',
          value: frequencyLabels[mealOptions.lunchFrequency as keyof typeof frequencyLabels],
        })
      }
    }

    if (mealOptions.dinnerOption && mealOptions.dinnerOption !== 'none') {
      items.push({
        label: 'Dinner',
        value: `${mealLabels[mealOptions.dinnerOption as keyof typeof mealLabels]} (${mealOptions.dinnerPortions || 0} portions)`,
        highlight: true,
      })
      if (mealOptions.dinnerFrequency) {
        items.push({
          label: 'Dinner Frequency',
          value: frequencyLabels[mealOptions.dinnerFrequency as keyof typeof frequencyLabels],
        })
      }
    }

    // If no services selected, show default message
    if (items.length === 1 && items[0].label === 'Airport Pickup' && !items[0].highlight) {
      items.push({
        label: 'Meal Options',
        value: 'No meal packages selected',
      })
    }

    return {
      id: 'services',
      title: 'Additional Services',
      icon: <Car className="h-4 w-4" />,
      onEdit,
      items,
    }
  },
}
