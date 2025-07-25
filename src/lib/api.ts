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

// Format auditorium booking data for PayloadCMS API
export function formatAuditoriumBookingForAPI(
  data: AuditoriumBookingFormData,
): Partial<AuditoriumBooking> {
  return {
    fullName: data.fullName,
    countryOfOrigin: data.countryOfOrigin,
    eventDetails: {
      eventName: data.eventDetails.eventName,
      eventDate: data.eventDetails.eventDate.toISOString(),
      eventTime: data.eventDetails.eventTime,
    },
    contactInfo: {
      egyptPhoneNumber: data.contactInfo.egyptPhoneNumber,
      whatsappNumber: data.contactInfo.whatsappNumber,
    },
    couponCode: data.couponCode || undefined,
    eventNotes: data.eventNotes || undefined,
    paymentStatus: 'INVOICED' as const,
  }
}

// Submit auditorium booking
export async function submitAuditoriumBooking(
  data: AuditoriumBookingFormData,
): Promise<AuditoriumBooking> {
  try {
    const formattedData = formatAuditoriumBookingForAPI(data)

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
