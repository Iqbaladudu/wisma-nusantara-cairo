'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Bed, Users, Plus, Minus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HostelBookingFormData } from '@/lib/schemas'
import { useTranslations } from 'next-intl'

interface RoomSelectionStepProps {
  form: UseFormReturn<HostelBookingFormData>
}

export function RoomSelectionStep({ form }: RoomSelectionStepProps) {
  const tRoom = useTranslations('hostel.room')
  const tGuests = useTranslations('hostel.room.guests')
  const tSummary = useTranslations('hostel.room.summary')
  const watchedValues = form.watch()

  // Calculate totals
  const totalRooms =
    (watchedValues.roomSelection?.singleBed || 0) + (watchedValues.roomSelection?.doubleBed || 0)
  const totalBeds = totalRooms + (watchedValues.roomSelection?.extraBed || 0)
  const totalGuests =
    (watchedValues.guestDetails?.adults || 0) + (watchedValues.guestDetails?.children || 0)

  // Helper function to update room count
  const updateRoomCount = (field: 'singleBed' | 'doubleBed' | 'extraBed', increment: boolean) => {
    const currentValue = watchedValues.roomSelection?.[field] || 0
    const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1)

    form.setValue(`roomSelection.${field}`, newValue, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  // Helper function to update guest count
  const updateGuestCount = (field: 'adults' | 'children', increment: boolean) => {
    const currentValue = watchedValues.guestDetails?.[field] || 0
    let newValue: number

    if (field === 'adults') {
      newValue = increment ? Math.min(20, currentValue + 1) : Math.max(1, currentValue - 1)
    } else {
      newValue = increment ? Math.min(7, currentValue + 1) : Math.max(0, currentValue - 1)
    }

    form.setValue(`guestDetails.${field}`, newValue, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  return (
    <div className="space-y-6">
      {/* Room Selection */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bed className="h-5 w-5 text-primary" />
            {tRoom('title')}
          </CardTitle>
          <CardDescription>{tRoom('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Single Bed Rooms */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{tRoom('single.title')}</span>
                <Badge variant="secondary">{tRoom('single.price')}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{tRoom('single.desc')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateRoomCount('singleBed', false)}
                disabled={(watchedValues.roomSelection?.singleBed || 0) <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">
                {watchedValues.roomSelection?.singleBed || 0}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateRoomCount('singleBed', true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Double Bed Rooms */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{tRoom('double.title')}</span>
                <Badge variant="secondary">{tRoom('double.price')}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{tRoom('double.desc')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateRoomCount('doubleBed', false)}
                disabled={(watchedValues.roomSelection?.doubleBed || 0) <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">
                {watchedValues.roomSelection?.doubleBed || 0}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateRoomCount('doubleBed', true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Extra Beds */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{tRoom('extra.title')}</span>
                <Badge variant="secondary">{tRoom('extra.price')}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{tRoom('extra.desc')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateRoomCount('extraBed', false)}
                disabled={(watchedValues.roomSelection?.extraBed || 0) <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">
                {watchedValues.roomSelection?.extraBed || 0}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateRoomCount('extraBed', true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guest Details */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-blue-500" />
            {tGuests('title')}
          </CardTitle>
          <CardDescription>{tGuests('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Adults */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <span className="font-medium">{tGuests('adults.label')}</span>
              <p className="text-sm text-muted-foreground">{tGuests('adults.desc')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateGuestCount('adults', false)}
                disabled={(watchedValues.guestDetails?.adults || 0) <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">
                {watchedValues.guestDetails?.adults || 1}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateGuestCount('adults', true)}
                disabled={(watchedValues.guestDetails?.adults || 0) >= 20}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <span className="font-medium">{tGuests('children.label')}</span>
              <p className="text-sm text-muted-foreground">{tGuests('children.desc')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateGuestCount('children', false)}
                disabled={(watchedValues.guestDetails?.children || 0) <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">
                {watchedValues.guestDetails?.children || 0}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateGuestCount('children', true)}
                disabled={(watchedValues.guestDetails?.children || 0) >= 7}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card
        className={`${totalBeds < totalGuests ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800' : 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'}`}
      >
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{totalRooms}</div>
              <div className="text-sm text-muted-foreground">{tSummary('rooms')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalBeds}</div>
              <div className="text-sm text-muted-foreground">{tSummary('beds')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalGuests}</div>
              <div className="text-sm text-muted-foreground">{tSummary('guests')}</div>
            </div>
          </div>
          {totalBeds < totalGuests && (
            <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300 text-center">
                {tSummary('warning')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
