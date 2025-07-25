'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import {
  User,
  MapPin,
  CreditCard,
  Bed,
  Users,
  Calendar,
  Phone,
  MessageCircle,
  Car,
  UtensilsCrossed,
  Tag,
  Edit2,
  DollarSign,
  FileCheck,
} from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { HostelBookingFormData } from '@/lib/schemas'
import { calculateBookingPrice } from '@/lib/api'

interface BookingSummaryStepProps {
  form: UseFormReturn<HostelBookingFormData>
  onEdit: (step: number) => void
}

export function BookingSummaryStep({ form, onEdit }: BookingSummaryStepProps) {
  const formData = form.getValues()
  const pricing = calculateBookingPrice(formData)

  // Helper function to format meal option names
  const formatMealOption = (option: string) => {
    const mealNames = {
      none: 'Tidak Pesan',
      nasi_goreng: 'Nasi Goreng',
      ayam_goreng: 'Ayam Goreng',
      nasi_kuning: 'Nasi Kuning',
    }
    return mealNames[option as keyof typeof mealNames] || option
  }

  // Helper function to format frequency
  const formatFrequency = (frequency: string) => {
    const frequencies = {
      checkin_only: 'Hari Check-in Saja',
      during_stay: 'Selama Menginap',
      checkout_only: 'Hari Check-out Saja',
    }
    return frequencies[frequency as keyof typeof frequencies] || frequency
  }

  // Helper function to format airport pickup
  const formatAirportPickup = (pickup: string) => {
    const pickupOptions = {
      none: 'Tidak Perlu Penjemputan',
      medium_vehicle: 'Medium Private Vehicle ($35)',
      hiace: 'Hiace Van ($50)',
    }
    return pickupOptions[pickup as keyof typeof pickupOptions] || pickup
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Ringkasan Booking</h2>
        <p className="text-muted-foreground">
          Periksa kembali semua detail booking Anda sebelum mengirim
        </p>
      </div>

      {/* Personal Information */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Informasi Personal
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(1)}
              className="text-primary hover:text-primary/80"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <User className="h-4 w-4" />
                Nama Lengkap
              </div>
              <p className="font-medium">{formData.fullName}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <MapPin className="h-4 w-4" />
                Asal Negara
              </div>
              <p className="font-medium">{formData.countryOfOrigin}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <CreditCard className="h-4 w-4" />
                Nomor Paspor
              </div>
              <p className="font-medium font-mono">{formData.passportNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Selection & Guests */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bed className="h-5 w-5 text-blue-500" />
              Kamar & Tamu
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(2)}
              className="text-blue-500 hover:text-blue-500/80"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-3">Pilihan Kamar</h4>
              <div className="space-y-2">
                {formData.roomSelection.singleBed > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Single Bed Room</span>
                    <Badge variant="secondary">{formData.roomSelection.singleBed} kamar</Badge>
                  </div>
                )}
                {formData.roomSelection.doubleBed > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Double Bed Room</span>
                    <Badge variant="secondary">{formData.roomSelection.doubleBed} kamar</Badge>
                  </div>
                )}
                {formData.roomSelection.extraBed > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Extra Bed</span>
                    <Badge variant="secondary">{formData.roomSelection.extraBed} bed</Badge>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Detail Tamu</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Orang Dewasa</span>
                  <Badge variant="secondary">{formData.guestDetails.adults} orang</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Anak-anak</span>
                  <Badge variant="secondary">{formData.guestDetails.children} orang</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stay Duration */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-green-500" />
              Durasi Menginap
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(3)}
              className="text-green-500 hover:text-green-500/80"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Check-in</div>
              <p className="font-medium">
                {format(formData.stayDuration.checkInDate, 'PPP', { locale: id })}
              </p>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Check-out</div>
              <p className="font-medium">
                {format(formData.stayDuration.checkOutDate, 'PPP', { locale: id })}
              </p>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Durasi</div>
              <Badge variant="secondary" className="text-base px-3 py-1">
                {pricing.breakdown.nights} malam
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5 text-purple-500" />
              Informasi Kontak
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(4)}
              className="text-purple-500 hover:text-purple-500/80"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </div>
              <p className="font-medium font-mono">{formData.contactInfo.whatsappNumber}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Phone className="h-4 w-4" />
                Telepon
              </div>
              <p className="font-medium font-mono">{formData.contactInfo.phoneNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Services */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Car className="h-5 w-5 text-orange-500" />
              Layanan Tambahan
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(5)}
              className="text-orange-500 hover:text-orange-500/80"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Coupon Code */}
          {formData.couponCode && (
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Tag className="h-4 w-4" />
                Kode Kupon
              </div>
              <Badge variant="outline" className="font-mono">
                {formData.couponCode}
              </Badge>
            </div>
          )}

          {/* Airport Pickup */}
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Car className="h-4 w-4" />
              Penjemputan Bandara
            </div>
            <p className="font-medium">{formatAirportPickup(formData.airportPickup)}</p>

            {formData.airportPickup !== 'none' && formData.departureDateTime?.departureDate && (
              <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-950 dark:border-orange-800">
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <span className="text-sm text-orange-700 dark:text-orange-300">Tanggal:</span>
                    <p className="font-medium text-orange-900 dark:text-orange-100">
                      {format(formData.departureDateTime.departureDate, 'PPP', { locale: id })}
                    </p>
                  </div>
                  {formData.departureDateTime.departureTime && (
                    <div>
                      <span className="text-sm text-orange-700 dark:text-orange-300">Waktu:</span>
                      <p className="font-medium text-orange-900 dark:text-orange-100">
                        {formData.departureDateTime.departureTime}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Meal Options */}
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <UtensilsCrossed className="h-4 w-4" />
              Paket Makanan
            </div>

            <div className="space-y-3">
              {/* Breakfast */}
              {formData.mealOptions?.breakfastOption !== 'none' &&
                formData.mealOptions?.breakfastPortions &&
                formData.mealOptions.breakfastPortions > 0 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-950 dark:border-orange-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-orange-900 dark:text-orange-100">
                          Sarapan: {formatMealOption(formData.mealOptions.breakfastOption)}
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          {formData.mealOptions.breakfastPortions} porsi •{' '}
                          {formatFrequency(
                            formData.mealOptions.breakfastFrequency || 'checkin_only',
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* Lunch */}
              {formData.mealOptions?.lunchOption !== 'none' &&
                formData.mealOptions?.lunchPortions &&
                formData.mealOptions.lunchPortions > 0 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-950 dark:border-orange-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-orange-900 dark:text-orange-100">
                          Makan Siang: {formatMealOption(formData.mealOptions.lunchOption)}
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          {formData.mealOptions.lunchPortions} porsi •{' '}
                          {formatFrequency(formData.mealOptions.lunchFrequency || 'checkin_only')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* Dinner */}
              {formData.mealOptions?.dinnerOption !== 'none' &&
                formData.mealOptions?.dinnerPortions &&
                formData.mealOptions.dinnerPortions > 0 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-950 dark:border-orange-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-orange-900 dark:text-orange-100">
                          Makan Malam: {formatMealOption(formData.mealOptions.dinnerOption)}
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          {formData.mealOptions.dinnerPortions} porsi •{' '}
                          {formatFrequency(formData.mealOptions.dinnerFrequency || 'checkin_only')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* No meals selected */}
              {(!formData.mealOptions?.breakfastOption ||
                formData.mealOptions.breakfastOption === 'none') &&
                (!formData.mealOptions?.lunchOption ||
                  formData.mealOptions.lunchOption === 'none') &&
                (!formData.mealOptions?.dinnerOption ||
                  formData.mealOptions.dinnerOption === 'none') && (
                  <p className="text-muted-foreground italic">
                    Tidak ada paket makanan yang dipilih
                  </p>
                )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Summary */}
      <Card className="border-l-4 border-l-green-600 bg-green-50 dark:bg-green-950">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-green-900 dark:text-green-100">
            <DollarSign className="h-5 w-5 text-green-600" />
            Ringkasan Biaya
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Room Costs */}
          <div className="space-y-3">
            <h4 className="font-medium text-green-900 dark:text-green-100">Biaya Kamar</h4>

            {pricing.breakdown.singleBedCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-300">
                  Single Bed ({formData.roomSelection.singleBed} kamar × {pricing.breakdown.nights}{' '}
                  malam)
                </span>
                <span className="font-medium text-green-900 dark:text-green-100">
                  ${pricing.breakdown.singleBedCost}
                </span>
              </div>
            )}

            {pricing.breakdown.doubleBedCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-300">
                  Double Bed ({formData.roomSelection.doubleBed} kamar × {pricing.breakdown.nights}{' '}
                  malam)
                </span>
                <span className="font-medium text-green-900 dark:text-green-100">
                  ${pricing.breakdown.doubleBedCost}
                </span>
              </div>
            )}

            {pricing.breakdown.extraBedCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700 dark:text-green-300">
                  Extra Bed ({formData.roomSelection.extraBed} bed × {pricing.breakdown.nights}{' '}
                  malam)
                </span>
                <span className="font-medium text-green-900 dark:text-green-100">
                  ${pricing.breakdown.extraBedCost}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-green-200 dark:border-green-800">
              <span className="font-medium text-green-900 dark:text-green-100">Subtotal Kamar</span>
              <span className="font-bold text-green-900 dark:text-green-100">
                ${pricing.roomCost}
              </span>
            </div>
          </div>

          {/* Additional Services Costs */}
          {pricing.additionalServicesCost > 0 && (
            <>
              <Separator className="bg-green-200 dark:bg-green-800" />
              <div className="space-y-3">
                <h4 className="font-medium text-green-900 dark:text-green-100">Layanan Tambahan</h4>

                {pricing.breakdown.airportPickupCost > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Penjemputan Bandara
                    </span>
                    <span className="font-medium text-green-900 dark:text-green-100">
                      ${pricing.breakdown.airportPickupCost}
                    </span>
                  </div>
                )}

                {pricing.breakdown.mealsCost > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Paket Makanan
                    </span>
                    <span className="font-medium text-green-900 dark:text-green-100">
                      {pricing.breakdown.mealsCost} EGP
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-green-200 dark:border-green-800">
                  <span className="font-medium text-green-900 dark:text-green-100">
                    Subtotal Layanan
                  </span>
                  <span className="font-bold text-green-900 dark:text-green-100">
                    ${pricing.breakdown.airportPickupCost} + {pricing.breakdown.mealsCost} EGP
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Total */}
          <Separator className="bg-green-200 dark:bg-green-800" />
          <div className="flex justify-between items-center pt-2">
            <span className="text-xl font-bold text-green-900 dark:text-green-100">
              Total Biaya
            </span>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                ${pricing.roomCost + pricing.breakdown.airportPickupCost}
              </div>
              {pricing.breakdown.mealsCost > 0 && (
                <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                  + {pricing.breakdown.mealsCost} EGP
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Informasi Penting</h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Konfirmasi booking akan dikirim melalui WhatsApp dalam 24 jam</li>
              <li>• Pembayaran dapat dilakukan setelah konfirmasi booking</li>
              <li>• Check-in: 14:00 - 23:00 | Check-out: 07:00 - 12:00</li>
              <li>• Bawa paspor asli untuk proses check-in</li>
              <li>• Hubungi customer service jika ada pertanyaan</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Terms of Service Agreement */}
      <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-amber-900 dark:text-amber-100">
            <FileCheck className="h-5 w-5 text-amber-600" />
            Syarat dan Ketentuan{/*  */}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
              <p className="font-medium">Dengan melanjutkan booking, Anda menyetujui:</p>
              <ul className="space-y-1 ml-4">
                <li>
                  • <strong>Jam Check-in:</strong> 13:00-22:00 (biaya tambahan untuk early/late
                  check-in)
                </li>
                <li>
                  • <strong>Jam Check-out:</strong> Maksimal 12:00 (biaya tambahan untuk late
                  check-out)
                </li>
                <li>
                  • <strong>Pembatalan:</strong> H-3 hingga H-0 dikenakan biaya 1 malam per kamar
                </li>
                <li>
                  • <strong>Kebijakan Merokok:</strong> Dilarang merokok (denda USD 100)
                </li>
                <li>
                  • <strong>Kerusakan:</strong> Tamu bertanggung jawab atas kerusakan properti
                </li>
                <li>
                  • <strong>Force Majeure:</strong> Wisma tidak bertanggung jawab atas keadaan tak
                  terduga
                </li>
                <li>
                  • <strong>Perubahan:</strong> Syarat dapat berubah tanpa pemberitahuan
                </li>
              </ul>
            </div>
          </div>

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
                    Saya telah membaca dan menyetujui semua syarat dan ketentuan di atas
                  </FormLabel>
                  <FormMessage className="text-red-600 dark:text-red-400" />
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  )
}
