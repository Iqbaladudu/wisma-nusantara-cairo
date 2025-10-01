import { HostelBookingFormData, AuditoriumBookingFormData } from './schemas'
import { HostelBooking, AuditoriumBooking } from '@/payload-types'

// API configuration
const API_BASE_URL = '/api'

// Error types
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// Format form data for PayloadCMS API
export function formatHostelBookingForAPI(data: HostelBookingFormData): Partial<HostelBooking> {
  return {
    fullName: data.fullName,
    countryOfOrigin: data.countryOfOrigin,
    passportNumber: data.passportNumber,
    roomSelection: {
      singleBed: data.roomSelection.singleBed,
      doubleBed: data.roomSelection.doubleBed,
      extraBed: data.roomSelection.extraBed,
    },
    guestDetails: {
      adults: data.guestDetails.adults,
      children: data.guestDetails.children,
    },
    stayDuration: {
      checkInDate: data.stayDuration.checkInDate.toISOString(),
      checkOutDate: data.stayDuration.checkOutDate.toISOString(),
    },
    contactInfo: {
      whatsappNumber: data.contactInfo.whatsappNumber,
      phoneNumber: data.contactInfo.phoneNumber,
    },
    couponCode: data.couponCode || undefined,
    airportPickup: data.airportPickup,
    departureDateTime: data.departureDateTime?.departureDate
      ? {
          departureDate: data.departureDateTime.departureDate.toISOString(),
          departureTime: data.departureDateTime.departureTime || undefined,
        }
      : undefined,
    mealOptions: data.mealOptions
      ? {
          breakfastOption: data.mealOptions.breakfastOption,
          breakfastPortions: data.mealOptions.breakfastPortions,
          breakfastFrequency: data.mealOptions.breakfastFrequency,
          lunchOption: data.mealOptions.lunchOption,
          lunchPortions: data.mealOptions.lunchPortions,
          lunchFrequency: data.mealOptions.lunchFrequency,
          dinnerOption: data.mealOptions.dinnerOption,
          dinnerPortions: data.mealOptions.dinnerPortions,
          dinnerFrequency: data.mealOptions.dinnerFrequency,
        }
      : undefined,
    paymentStatus: 'INVOICED' as const,
  }
}

// Submit hostel booking
export async function submitHostelBooking(data: HostelBookingFormData): Promise<HostelBooking> {
  try {
    const formattedData = formatHostelBookingForAPI(data)

    const response = await fetch(`${API_BASE_URL}/hostel-bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData,
      )
    }

    const result = await response.json()
    return result.doc || result
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    // Network or other errors
    throw new APIError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      0,
      error,
    )
  }
}

// Validate coupon code
export async function validateCoupon(couponCode: string): Promise<{
  valid: boolean
  discount?: number
  message?: string
}> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coupons?where[code][equals]=${encodeURIComponent(couponCode)}`,
    )

    if (!response.ok) {
      return { valid: false, message: 'Error validating coupon' }
    }

    const result = await response.json()
    const coupons = result.docs || []

    if (coupons.length === 0) {
      return { valid: false, message: 'Coupon code not found' }
    }

    const coupon = coupons[0]

    // Check if coupon is active
    if (!coupon.isActive) {
      return { valid: false, message: 'Coupon is no longer active' }
    }

    // Check expiry date
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, message: 'Coupon has expired' }
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: 'Coupon usage limit reached' }
    }

    return {
      valid: true,
      discount: coupon.discountPercentage || coupon.discountAmount || 0,
      message: 'Coupon is valid',
    }
  } catch (error) {
    return { valid: false, message: 'Error validating coupon' }
  }
}

// Calculate pricing (this would typically be done on the server)
export function calculateBookingPrice(data: Partial<HostelBookingFormData>): {
  roomCost: number
  additionalServicesCost: number
  totalCost: number
  breakdown: {
    singleBedCost: number
    doubleBedCost: number
    extraBedCost: number
    airportPickupCost: number
    mealsCost: number
    nights: number
  }
} {
  // Base pricing (should match PayloadCMS collection pricing)
  const SINGLE_BED_PRICE = 30 // USD per night
  const DOUBLE_BED_PRICE = 35 // USD per night
  const EXTRA_BED_PRICE = 10 // USD per night

  const AIRPORT_PICKUP_PRICES = {
    none: 0,
    medium_vehicle: 35,
    hiace: 50,
  }

  const MEAL_PRICES = {
    none: 0,
    nasi_goreng: 100, // EGP per person
    ayam_goreng: 120, // EGP per person
    nasi_kuning: 130, // EGP per person
  }

  // Calculate nights
  let nights = 1
  if (data.stayDuration?.checkInDate && data.stayDuration?.checkOutDate) {
    const checkIn = new Date(data.stayDuration.checkInDate)
    const checkOut = new Date(data.stayDuration.checkOutDate)
    const timeDiff = checkOut.getTime() - checkIn.getTime()
    nights = Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  // Room costs
  const singleBedCost = (data.roomSelection?.singleBed || 0) * SINGLE_BED_PRICE * nights
  const doubleBedCost = (data.roomSelection?.doubleBed || 0) * DOUBLE_BED_PRICE * nights
  const extraBedCost = (data.roomSelection?.extraBed || 0) * EXTRA_BED_PRICE * nights
  const roomCost = singleBedCost + doubleBedCost + extraBedCost

  // Airport pickup cost
  const airportPickupCost = AIRPORT_PICKUP_PRICES[data.airportPickup || 'none']

  // Meals cost (simplified calculation)
  let mealsCost = 0
  if (data.mealOptions) {
    const totalGuests = (data.guestDetails?.adults || 0) + (data.guestDetails?.children || 0)

    if (data.mealOptions.breakfastOption !== 'none' && data.mealOptions.breakfastPortions) {
      mealsCost +=
        MEAL_PRICES[data.mealOptions.breakfastOption] * data.mealOptions.breakfastPortions
    }
    if (data.mealOptions.lunchOption !== 'none' && data.mealOptions.lunchPortions) {
      mealsCost += MEAL_PRICES[data.mealOptions.lunchOption] * data.mealOptions.lunchPortions
    }
    if (data.mealOptions.dinnerOption !== 'none' && data.mealOptions.dinnerPortions) {
      mealsCost += MEAL_PRICES[data.mealOptions.dinnerOption] * data.mealOptions.dinnerPortions
    }
  }

  const additionalServicesCost = airportPickupCost + mealsCost
  const totalCost = roomCost + additionalServicesCost

  return {
    roomCost,
    additionalServicesCost,
    totalCost,
    breakdown: {
      singleBedCost,
      doubleBedCost,
      extraBedCost,
      airportPickupCost,
      mealsCost,
      nights,
    },
  }
}

// AUDITORIUM BOOKING API FUNCTIONS

// Auditorium pricing packages (in EGP)
const AUDITORIUM_PACKAGES = {
  1: 115, // 1 hour
  4: 420, // 4 hours
  9: 900, // 9 hours
  12: 1100, // 12 hours
  14: 1250, // 14 hours
} as const

// Exclude services pricing (in EGP)
const EXCLUDE_SERVICES_PRICING = {
  airConditioner: {
    none: 0,
    '4-6_hours': 150,
    '7-9_hours': 200,
    '10-12_hours': 300,
    '13-14_hours': 350,
  },
  extraChairs: {
    none: 0,
    '3_chairs': 75,
    '5_chairs': 120,
    '7_chairs': 160,
    '10_chairs': 210,
    '15_chairs': 300,
    '20_chairs': 380,
    '30_chairs': 540,
    '40_chairs': 680,
  },
  projector: {
    none: 0,
    projector_only: 250,
    screen_only: 75,
    projector_and_screen: 275,
  },
  extraTables: {
    none: 0,
    '3_tables': 140,
    '6_tables': 240,
    '9_tables': 300,
    more_than_9: 0, // Contact for availability
  },
  plates: {
    none: 0,
    '6_plates': 60,
    '12_plates': 110,
    '18_plates': 160,
    '24_plates': 200,
  },
  glasses: {
    none: 0,
    '3_glasses': 20,
    '6_glasses': 35,
    '12_glasses': 60,
  },
} as const

// Calculate auditorium pricing based on duration
export function calculateAuditoriumPrice(
  startTime: string,
  endTime: string,
): {
  totalHours: number
  totalPrice: number
  priceBreakdown: string
  packageUsed: string
} {
  if (!startTime || !endTime) {
    return {
      totalHours: 0,
      totalPrice: 0,
      priceBreakdown: 'Waktu belum ditentukan',
      packageUsed: 'Belum ada paket',
    }
  }

  // Convert time strings to minutes
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)

  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin

  // Calculate duration in hours (rounded up to nearest hour)
  const durationMinutes = endMinutes - startMinutes
  const totalHours = Math.ceil(durationMinutes / 60)

  if (totalHours <= 0) {
    return {
      totalHours: 0,
      totalPrice: 0,
      priceBreakdown: 'Durasi tidak valid',
      packageUsed: 'Tidak ada paket',
    }
  }

  // Find the best pricing combination
  let remainingHours = totalHours
  let totalPrice = 0
  const usedPackages: string[] = []

  // Sort packages by efficiency (price per hour)
  const packagesByEfficiency = [
    { hours: 14, price: 1250, efficiency: 1250 / 14 },
    { hours: 12, price: 1100, efficiency: 1100 / 12 },
    { hours: 9, price: 900, efficiency: 900 / 9 },
    { hours: 4, price: 420, efficiency: 420 / 4 },
    { hours: 1, price: 115, efficiency: 115 / 1 },
  ].sort((a, b) => a.efficiency - b.efficiency)

  // Use the most efficient packages first
  for (const pkg of packagesByEfficiency) {
    while (remainingHours >= pkg.hours) {
      remainingHours -= pkg.hours
      totalPrice += pkg.price
      usedPackages.push(`Paket ${pkg.hours} Jam (${pkg.price} EGP)`)
    }
  }

  // Handle any remaining hours with 1-hour packages
  while (remainingHours > 0) {
    remainingHours -= 1
    totalPrice += AUDITORIUM_PACKAGES[1]
    usedPackages.push(`Paket 1 Jam (${AUDITORIUM_PACKAGES[1]} EGP)`)
  }

  const priceBreakdown = usedPackages.join(' + ')
  const packageUsed =
    usedPackages.length === 1 ? usedPackages[0] : `${usedPackages.length} paket kombinasi`

  return {
    totalHours,
    totalPrice,
    priceBreakdown,
    packageUsed,
  }
}

// Calculate exclude services pricing
export function calculateExcludeServicesPrice(excludeServices: any): {
  totalPrice: number
  breakdown: string[]
  details: { [key: string]: { selected: string; price: number } }
} {
  if (!excludeServices) {
    return {
      totalPrice: 0,
      breakdown: [],
      details: {},
    }
  }

  let totalPrice = 0
  const breakdown: string[] = []
  const details: { [key: string]: { selected: string; price: number } } = {}

  // Air Conditioner
  if (excludeServices.airConditioner && excludeServices.airConditioner !== 'none') {
    const price = EXCLUDE_SERVICES_PRICING.airConditioner[excludeServices.airConditioner] || 0
    totalPrice += price
    const label = excludeServices.airConditioner.replace('_', '-').replace('hours', 'jam')
    breakdown.push(`AC ${label}: ${price} EGP`)
    details.airConditioner = { selected: excludeServices.airConditioner, price }
  }

  // Extra Chairs
  if (excludeServices.extraChairs && excludeServices.extraChairs !== 'none') {
    const price = EXCLUDE_SERVICES_PRICING.extraChairs[excludeServices.extraChairs] || 0
    totalPrice += price
    const chairCount = excludeServices.extraChairs.replace('_chairs', '')
    breakdown.push(`${chairCount} Kursi Ekstra: ${price} EGP`)
    details.extraChairs = { selected: excludeServices.extraChairs, price }
  }

  // Projector
  if (excludeServices.projector && excludeServices.projector !== 'none') {
    const price = EXCLUDE_SERVICES_PRICING.projector[excludeServices.projector] || 0
    totalPrice += price
    let label = ''
    switch (excludeServices.projector) {
      case 'projector_only':
        label = 'Proyektor'
        break
      case 'screen_only':
        label = 'Layar'
        break
      case 'projector_and_screen':
        label = 'Proyektor + Layar'
        break
    }
    breakdown.push(`${label}: ${price} EGP`)
    details.projector = { selected: excludeServices.projector, price }
  }

  // Extra Tables
  if (excludeServices.extraTables && excludeServices.extraTables !== 'none') {
    const price = EXCLUDE_SERVICES_PRICING.extraTables[excludeServices.extraTables] || 0
    totalPrice += price
    if (excludeServices.extraTables === 'more_than_9') {
      breakdown.push('Lebih dari 9 Meja: Tanya ketersediaan')
    } else {
      const tableCount = excludeServices.extraTables.replace('_tables', '')
      breakdown.push(`${tableCount} Meja Tambahan: ${price} EGP`)
    }
    details.extraTables = { selected: excludeServices.extraTables, price }
  }

  // Plates
  if (excludeServices.plates && excludeServices.plates !== 'none') {
    const price = EXCLUDE_SERVICES_PRICING.plates[excludeServices.plates] || 0
    totalPrice += price
    const plateCount = excludeServices.plates.replace('_plates', '')
    breakdown.push(`${plateCount} Piring: ${price} EGP`)
    details.plates = { selected: excludeServices.plates, price }
  }

  // Glasses
  if (excludeServices.glasses && excludeServices.glasses !== 'none') {
    const price = EXCLUDE_SERVICES_PRICING.glasses[excludeServices.glasses] || 0
    totalPrice += price
    const glassCount = excludeServices.glasses.replace('_glasses', '')
    breakdown.push(`${glassCount} Gelas: ${price} EGP`)
    details.glasses = { selected: excludeServices.glasses, price }
  }

  return {
    totalPrice,
    breakdown,
    details,
  }
}

// Format auditorium booking data for PayloadCMS API
export function formatAuditoriumBookingForAPI(
  data: AuditoriumBookingFormData,
): Partial<AuditoriumBooking> {
  const basePricing = calculateAuditoriumPrice(
    data.eventDetails.eventTime,
    data.eventDetails.eventEndTime,
  )

  const excludeServicesPricing = calculateExcludeServicesPrice(data.excludeServices)
  const totalPrice = basePricing.totalPrice + excludeServicesPricing.totalPrice

  // Clean phone numbers (remove spaces and special characters except +)
  const cleanEgyptPhone = data.contactInfo.egyptPhoneNumber.replace(/[\s\-\(\)]/g, '')
  const cleanWhatsAppPhone = data.contactInfo.whatsappNumber.replace(/[\s\-\(\)]/g, '')

  return {
    fullName: data.fullName,
    countryOfOrigin: data.countryOfOrigin,
    eventDetails: {
      eventName: data.eventDetails.eventName,
      eventDate: data.eventDetails.eventDate.toISOString(),
      eventTime: data.eventDetails.eventTime,
      eventEndTime: data.eventDetails.eventEndTime,
    },
    contactInfo: {
      egyptPhoneNumber: cleanEgyptPhone,
      whatsappNumber: cleanWhatsAppPhone,
    },
    excludeServices: data.excludeServices,
    pricing: {
      basePrice: basePricing.totalPrice,
      excludeServicesPrice: excludeServicesPricing.totalPrice,
      finalPrice: totalPrice,
      priceBreakdown: basePricing.priceBreakdown,
      excludeServicesBreakdown: excludeServicesPricing.breakdown.join(', '),
    },
    couponCode: data.couponCode || undefined,
    eventNotes: data.eventNotes || undefined,
    acceptTerms: data.acceptTerms,
    paymentStatus: 'INVOICED' as const,
  }
}

// Submit auditorium booking
export async function submitAuditoriumBooking(
  data: AuditoriumBookingFormData,
): Promise<AuditoriumBooking> {
  try {
    const formattedData = formatAuditoriumBookingForAPI(data)

    // Debug logging
    console.log('Submitting auditorium booking with data:', {
      egyptPhoneNumber: data.contactInfo.egyptPhoneNumber,
      whatsappNumber: data.contactInfo.whatsappNumber,
      formattedData: formattedData.contactInfo,
    })

    const response = await fetch(`${API_BASE_URL}/auditorium-bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData,
      )
    }

    const result = await response.json()
    return result.doc || result
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    // Network or other errors
    throw new APIError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      0,
      error,
    )
  }
}
