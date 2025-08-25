import { z } from 'zod'

// Base validation schemas
// Phone number regex for international format (E.164)
// Accepts formats like: +1234567890, +62812345678, +201234567890
const phoneRegex = /^\+[1-9]\d{6,14}$/
// Egyptian phone number regex - more flexible
const egyptPhoneRegex = /^(\+20|20|0)?1[0125]\d{8}$/
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

// Personal Information Schema
export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  countryOfOrigin: z.string().min(2, 'Asal negara harus diisi'),
  passportNumber: z.string().min(6, 'Nomor paspor minimal 6 karakter'),
})

// Room Selection Schema
export const roomSelectionSchema = z
  .object({
    roomSelection: z.object({
      singleBed: z.number().min(0, 'Jumlah tidak boleh negatif'),
      doubleBed: z.number().min(0, 'Jumlah tidak boleh negatif'),
      extraBed: z.number().min(0, 'Jumlah tidak boleh negatif'),
    }),
    guestDetails: z.object({
      adults: z.number().min(1, 'Minimal 1 orang dewasa').max(40, 'Maksimal 40 orang'),
      children: z.number().min(0, 'Jumlah tidak boleh negatif').max(40, 'Maksimal 40 anak'),
    }),
  })
  .refine(
    (data) => {
      const totalRooms = data.roomSelection.singleBed + data.roomSelection.doubleBed
      const totalBeds = totalRooms + data.roomSelection.extraBed
      const totalGuests = data.guestDetails.adults + data.guestDetails.children
      return totalBeds >= totalGuests
    },
    {
      message: 'Jumlah tempat tidur harus mencukupi untuk semua tamu',
      path: ['roomSelection'],
    },
  )

// Stay Duration Schema
export const stayDurationSchema = z
  .object({
    stayDuration: z.object({
      checkInDate: z
        .date({
          message: 'Tanggal check-in harus diisi',
        })
        .refine((date) => {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          return date >= today
        }, 'Tanggal check-in tidak boleh di masa lalu'),
      checkOutDate: z.date({
        message: 'Tanggal check-out harus diisi',
      }),
    }),
  })
  .refine(
    (data) => {
      return data.stayDuration.checkOutDate > data.stayDuration.checkInDate
    },
    {
      message: 'Tanggal check-out harus setelah check-in',
      path: ['stayDuration', 'checkOutDate'],
    },
  )

// Contact Information Schema
export const contactInfoSchema = z.object({
  contactInfo: z.object({
    whatsappNumber: z
      .string()
      .min(1, 'Nomor WhatsApp harus diisi')
      .regex(phoneRegex, 'Format nomor WhatsApp tidak valid'),
    phoneNumber: z
      .string()
      .min(1, 'Nomor telepon harus diisi')
      .regex(phoneRegex, 'Format nomor telepon tidak valid'),
  }),
})

// Additional Services Schema
export const additionalServicesSchema = z.object({
  couponCode: z.string().optional(),
  airportPickup: z.enum(['none', 'medium_vehicle', 'hiace']).default('none'),
  departureDateTime: z
    .object({
      departureDate: z.date().optional(),
      departureTime: z
        .string()
        .optional()
        .refine((val) => !val || val === '' || timeRegex.test(val), 'Format waktu harus HH:MM'),
    })
    .optional(),
  mealOptions: z
    .object({
      breakfastOption: z
        .enum(['none', 'nasi_goreng', 'ayam_goreng', 'nasi_kuning'])
        .default('none'),
      breakfastPortions: z.number().min(0).optional(),
      breakfastFrequency: z.enum(['checkin_only', 'during_stay', 'checkout_only']).optional(),
      lunchOption: z.enum(['none', 'nasi_goreng', 'ayam_goreng', 'nasi_kuning']).default('none'),
      lunchPortions: z.number().min(0).optional(),
      lunchFrequency: z.enum(['checkin_only', 'during_stay', 'checkout_only']).optional(),
      dinnerOption: z.enum(['none', 'nasi_goreng', 'ayam_goreng', 'nasi_kuning']).default('none'),
      dinnerPortions: z.number().min(0).optional(),
      dinnerFrequency: z.enum(['checkin_only', 'during_stay', 'checkout_only']).optional(),
    })
    .optional(),
})

// Terms of Service Schema
export const termsOfServiceSchema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Anda harus menyetujui syarat dan ketentuan untuk melanjutkan',
  }),
})

// Complete Hostel Booking Schema
export const hostelBookingSchema = personalInfoSchema
  .merge(roomSelectionSchema)
  .merge(stayDurationSchema)
  .merge(contactInfoSchema)
  .merge(additionalServicesSchema)
  .merge(termsOfServiceSchema)

// Type inference
export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type RoomSelection = z.infer<typeof roomSelectionSchema>
export type StayDuration = z.infer<typeof stayDurationSchema>
export type ContactInfo = z.infer<typeof contactInfoSchema>
export type AdditionalServices = z.infer<typeof additionalServicesSchema>
export type TermsOfService = z.infer<typeof termsOfServiceSchema>
export type HostelBookingFormData = z.infer<typeof hostelBookingSchema>

// Step validation schemas for multistep form
export const stepSchemas = {
  1: personalInfoSchema,
  2: roomSelectionSchema,
  3: stayDurationSchema,
  4: contactInfoSchema,
  5: additionalServicesSchema,
  6: hostelBookingSchema, // Final validation including terms
} as const

// AUDITORIUM BOOKING SCHEMAS

// Auditorium Personal Information Schema
export const auditoriumPersonalInfoSchema = z.object({
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  countryOfOrigin: z.string().min(2, 'Asal negara harus diisi'),
})

// Event Details Schema
export const eventDetailsSchema = z
  .object({
    eventDetails: z.object({
      eventName: z.string().min(2, 'Nama acara minimal 2 karakter'),
      eventDate: z
        .date({
          message: 'Tanggal acara harus diisi',
        })
        .refine((date) => {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          return date >= today
        }, 'Tanggal acara tidak boleh di masa lalu'),
      eventTime: z
        .string()
        .min(1, 'Waktu mulai acara harus diisi')
        .regex(timeRegex, 'Format waktu harus HH:MM (24 jam)'),
      eventEndTime: z
        .string()
        .min(1, 'Waktu selesai acara harus diisi')
        .regex(timeRegex, 'Format waktu harus HH:MM (24 jam)'),
    }),
  })
  .refine(
    (data) => {
      const startTime = data.eventDetails.eventTime
      const endTime = data.eventDetails.eventEndTime

      if (!startTime || !endTime) return true

      // Convert time strings to minutes for comparison
      const [startHour, startMin] = startTime.split(':').map(Number)
      const [endHour, endMin] = endTime.split(':').map(Number)

      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin

      return endMinutes > startMinutes
    },
    {
      message: 'Waktu selesai harus lebih besar dari waktu mulai',
      path: ['eventDetails', 'eventEndTime'],
    },
  )

// Auditorium Contact Information Schema
export const auditoriumContactInfoSchema = z.object({
  contactInfo: z.object({
    egyptPhoneNumber: z
      .string()
      .min(1, 'Nomor telepon Egypt harus diisi')
      .refine((val) => {
        // Clean the phone number (remove spaces and special characters)
        const cleanPhone = val.replace(/[\s\-\(\)]/g, '')
        // More flexible Egyptian phone validation
        return egyptPhoneRegex.test(cleanPhone)
      }, 'Format nomor telepon Egypt tidak valid (gunakan format: +201xxxxxxxxx atau 01xxxxxxxxx)'),
    whatsappNumber: z
      .string()
      .min(1, 'Nomor WhatsApp harus diisi')
      .refine((val) => {
        // Clean the phone number (remove spaces and special characters)
        const cleanPhone = val.replace(/[\s\-\(\)]/g, '')
        // International phone validation
        return phoneRegex.test(cleanPhone)
      }, 'Format nomor WhatsApp tidak valid (gunakan format internasional: +1234567890)'),
  }),
})

// Exclude Services Schema
export const auditoriumExcludeServicesSchema = z.object({
  excludeServices: z.object({
    airConditioner: z
      .enum(['none', '4-6_hours', '7-9_hours', '9-12_hours', '12-14_hours'])
      .default('none'),
    extraChairs: z
      .enum([
        'none',
        '3_chairs',
        '5_chairs',
        '7_chairs',
        '10_chairs',
        '15_chairs',
        '20_chairs',
        '30_chairs',
        '40_chairs',
      ])
      .default('none'),
    projector: z
      .enum(['none', 'projector_only', 'screen_only', 'projector_and_screen'])
      .default('none'),
    extraTables: z
      .enum(['none', '3_tables', '6_tables', '9_tables', 'more_than_9'])
      .default('none'),
    plates: z.enum(['none', '6_plates', '12_plates', '18_plates', '24_plates']).default('none'),
    glasses: z.enum(['none', '3_glasses', '6_glasses', '12_glasses']).default('none'),
  }),
})

// Additional Information Schema
export const auditoriumAdditionalInfoSchema = z.object({
  couponCode: z.string().optional(),
  eventNotes: z.string().optional(),
})

// Auditorium Terms of Service Schema
export const auditoriumTermsOfServiceSchema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Anda harus menyetujui syarat dan ketentuan untuk melanjutkan',
  }),
})

// Complete Auditorium Booking Schema
export const auditoriumBookingSchema = auditoriumPersonalInfoSchema
  .merge(eventDetailsSchema)
  .merge(auditoriumContactInfoSchema)
  .merge(auditoriumExcludeServicesSchema)
  .merge(auditoriumAdditionalInfoSchema)
  .merge(auditoriumTermsOfServiceSchema)

// Auditorium Type inference
export type AuditoriumPersonalInfo = z.infer<typeof auditoriumPersonalInfoSchema>
export type EventDetails = z.infer<typeof eventDetailsSchema>
export type AuditoriumContactInfo = z.infer<typeof auditoriumContactInfoSchema>
export type AuditoriumAdditionalInfo = z.infer<typeof auditoriumAdditionalInfoSchema>
export type AuditoriumBookingFormData = z.infer<typeof auditoriumBookingSchema>

// Auditorium Step validation schemas for multistep form
export const auditoriumStepSchemas = {
  1: auditoriumPersonalInfoSchema,
  2: eventDetailsSchema,
  3: auditoriumContactInfoSchema,
  4: auditoriumExcludeServicesSchema,
  5: auditoriumAdditionalInfoSchema,
  6: auditoriumBookingSchema, // Final validation (includes terms acceptance)
} as const

// Auditorium Default values
export const auditoriumDefaultValues: Partial<AuditoriumBookingFormData> = {
  fullName: '',
  countryOfOrigin: '',
  eventDetails: {
    eventName: '',
    eventDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    eventTime: '',
    eventEndTime: '',
  },
  contactInfo: {
    egyptPhoneNumber: '',
    whatsappNumber: '',
  },
  excludeServices: {
    airConditioner: 'none',
    extraChairs: 'none',
    projector: 'none',
    extraTables: 'none',
    plates: 'none',
    glasses: 'none',
  },
  couponCode: '',
  eventNotes: '',
  acceptTerms: false,
}

// Default values
export const defaultValues: Partial<HostelBookingFormData> = {
  fullName: '',
  countryOfOrigin: '',
  passportNumber: '',
  roomSelection: {
    singleBed: 0,
    doubleBed: 0,
    extraBed: 0,
  },
  guestDetails: {
    adults: 1,
    children: 0,
  },
  stayDuration: {
    checkInDate: new Date(),
    checkOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  },
  contactInfo: {
    whatsappNumber: '',
    phoneNumber: '',
  },
  couponCode: '',
  airportPickup: 'none',
  departureDateTime: {
    departureDate: undefined,
    departureTime: '',
  },
  mealOptions: {
    breakfastOption: 'none',
    breakfastPortions: 0,
    breakfastFrequency: 'checkin_only',
    lunchOption: 'none',
    lunchPortions: 0,
    lunchFrequency: 'checkin_only',
    dinnerOption: 'none',
    dinnerPortions: 0,
    dinnerFrequency: 'checkin_only',
  },
  acceptTerms: false,
}
