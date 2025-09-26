import type { CollectionConfig } from 'payload'
import SendWaCell from '../app/(payload)/admin/components/SendWaCell'
import { sendWhatsAppMessage } from '../lib/whatsapp-api'

export const AuditoriumBooking: CollectionConfig = {
  slug: 'auditorium-bookings',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: [
      'fullName',
      'eventDate',
      'eventTime',
      'paymentStatus',
      'resendConfirmation',
      'createdAt',
    ],
    group: 'Bookings',
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'resendConfirmation',
      label: 'Kirim Ulang WA',
      type: 'ui',
      admin: {
        components: {
          Cell: 'src/app/(payload)/admin/components/SendWaCell.tsx',
        },
      },
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Nama Lengkap',
    },
    {
      name: 'countryOfOrigin',
      type: 'text',
      required: true,
      label: 'Asal Negara',
    },
    {
      name: 'eventDetails',
      type: 'group',
      label: 'Detail Acara',
      fields: [
        {
          name: 'eventName',
          type: 'text',
          required: true,
          label: 'Nama Acara',
        },
        {
          name: 'eventDate',
          type: 'date',
          required: true,
          label: 'Tanggal Acara',
          validate: (val: any) => {
            if (!val) return true
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            if (new Date(val) < today) {
              return 'Event date cannot be in the past'
            }
            return true
          },
        },
        {
          name: 'eventTime',
          type: 'text',
          required: true,
          label: 'Waktu Mulai Acara',
          validate: (val: any) => {
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
            if (!timeRegex.test(val)) {
              return 'Please enter time in HH:MM format (24-hour)'
            }
            return true
          },
        },
        {
          name: 'eventEndTime',
          type: 'text',
          required: true,
          label: 'Waktu Selesai Acara',
          validate: (val: any) => {
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
            if (!timeRegex.test(val)) {
              return 'Please enter time in HH:MM format (24-hour)'
            }
            return true
          },
        },
      ],
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Informasi Kontak',
      fields: [
        {
          name: 'egyptPhoneNumber',
          type: 'text',
          required: true,
          label: 'Nomor Telepon (Egypt)',
          validate: (val: any) => {
            if (!val || typeof val !== 'string') {
              return 'Phone number is required'
            }

            // Clean the phone number (remove spaces and special characters)
            const cleanPhone = val.replace(/[\s\-\(\)]/g, '')

            // Egyptian phone number validation - more flexible
            // Accepts: +201234567890, 01234567890, 1234567890
            const egyptPhoneRegex = /^(\+20|20|0)?1[0125]\d{8}$/

            if (!egyptPhoneRegex.test(cleanPhone)) {
              return 'Please enter a valid Egyptian phone number (format: +201xxxxxxxxx or 01xxxxxxxxx)'
            }
            return true
          },
        },
        {
          name: 'whatsappNumber',
          type: 'text',
          required: true,
          label: 'Nomor WhatsApp',
          validate: (val: any) => {
            if (!val || typeof val !== 'string') {
              return 'WhatsApp number is required'
            }

            // Clean the phone number (remove spaces and special characters)
            const cleanPhone = val.replace(/[\s\-\(\)]/g, '')

            // International phone number validation - more flexible
            // Must start with + and have 7-15 digits total
            const phoneRegex = /^\+[1-9]\d{6,14}$/

            if (!phoneRegex.test(cleanPhone)) {
              return 'Please enter a valid WhatsApp number in international format (+1234567890)'
            }
            return true
          },
        },
      ],
    },
    // Exclude Services
    {
      name: 'excludeServices',
      type: 'group',
      label: 'Layanan Tambahan',
      fields: [
        {
          name: 'airConditioner',
          type: 'select',
          label: 'Air Conditioner (AC)',
          defaultValue: 'none',
          options: [
            { label: 'Tidak menggunakan AC', value: 'none' },
            { label: '4 - 6 Jam: 100 EGP', value: '4-6_hours' },
            { label: '7 - 9 Jam: 150 EGP', value: '7-9_hours' },
            { label: '9 - 12 Jam: 250 EGP', value: '9-12_hours' },
            { label: '12 - 14 Jam: 300 EGP', value: '12-14_hours' },
          ],
        },
        {
          name: 'extraChairs',
          type: 'select',
          label: 'Kursi Ekstra',
          defaultValue: 'none',
          options: [
            { label: 'Tidak membutuhkan', value: 'none' },
            { label: '3 kursi: 75 EGP', value: '3_chairs' },
            { label: '5 kursi: 120 EGP', value: '5_chairs' },
            { label: '7 kursi: 160 EGP', value: '7_chairs' },
            { label: '10 kursi: 210 EGP', value: '10_chairs' },
            { label: '15 kursi: 300 EGP', value: '15_chairs' },
            { label: '20 kursi: 380 EGP', value: '20_chairs' },
            { label: '30 kursi: 540 EGP', value: '30_chairs' },
            { label: '40 kursi: 680 EGP', value: '40_chairs' },
          ],
        },
        {
          name: 'projector',
          type: 'select',
          label: 'Proyektor',
          defaultValue: 'none',
          options: [
            { label: 'Tidak membutuhkan proyektor', value: 'none' },
            { label: 'Proyektor saja: 250 EGP', value: 'projector_only' },
            { label: 'Layar saja: 75 EGP', value: 'screen_only' },
            { label: 'Proyektor dan Layar: 275 EGP', value: 'projector_and_screen' },
          ],
          admin: {
            description:
              'BenQ GV30 - Resolusi 720p, portable, koneksi kabel & nirkabel, speaker terintegrasi',
          },
        },
        {
          name: 'extraTables',
          type: 'select',
          label: 'Meja Tambahan',
          defaultValue: 'none',
          options: [
            { label: 'Tidak membutuhkan meja', value: 'none' },
            { label: '3 meja: 140 EGP', value: '3_tables' },
            { label: '6 meja: 240 EGP', value: '6_tables' },
            { label: '9 meja: 300 EGP', value: '9_tables' },
            { label: 'Lebih dari 9 meja: Tanya ketersediaan', value: 'more_than_9' },
          ],
        },
        {
          name: 'plates',
          type: 'select',
          label: 'Piring',
          defaultValue: 'none',
          options: [
            { label: 'Tidak membutuhkan', value: 'none' },
            { label: '6 piring: 60 EGP', value: '6_plates' },
            { label: '12 piring: 110 EGP', value: '12_plates' },
            { label: '18 piring: 160 EGP', value: '18_plates' },
            { label: '24 piring: 200 EGP', value: '24_plates' },
          ],
        },
        {
          name: 'glasses',
          type: 'select',
          label: 'Gelas',
          defaultValue: 'none',
          options: [
            { label: 'Tidak membutuhkan gelas', value: 'none' },
            { label: '3 gelas: 20 EGP', value: '3_glasses' },
            { label: '6 gelas: 35 EGP', value: '6_glasses' },
            { label: '12 gelas: 60 EGP', value: '12_glasses' },
          ],
        },
      ],
    },
    {
      name: 'couponCode',
      type: 'text',
      label: 'Coupon Code',
      admin: {
        description: 'Optional coupon code for discount',
      },
    },
    {
      name: 'pricing',
      type: 'group',
      label: 'Pricing Details',
      fields: [
        {
          name: 'basePrice',
          type: 'number',
          label: 'Base Price (EGP)',
          admin: {
            readOnly: true,
            step: 0.01,
            description: 'Calculated base price before discounts',
          },
        },
        {
          name: 'seasonalMultiplier',
          type: 'number',
          label: 'Seasonal Multiplier',
          admin: {
            readOnly: true,
            step: 0.01,
            description: 'Applied seasonal pricing multiplier',
          },
        },
        {
          name: 'weekendMultiplier',
          type: 'number',
          label: 'Weekend Multiplier',
          admin: {
            readOnly: true,
            step: 0.01,
            description: 'Applied weekend pricing multiplier',
          },
        },
        {
          name: 'couponDiscount',
          type: 'number',
          label: 'Coupon Discount (EGP)',
          admin: {
            readOnly: true,
            step: 0.01,
            description: 'Discount applied from coupon',
          },
        },
        {
          name: 'finalPrice',
          type: 'number',
          required: true,
          min: 0,
          label: 'Final Price (EGP)',
          admin: {
            readOnly: true,
            step: 0.01,
            description: 'Final calculated price',
          },
        },
        {
          name: 'priceBreakdown',
          type: 'textarea',
          label: 'Price Breakdown',
          admin: {
            readOnly: true,
            description: 'Detailed breakdown of price calculation',
          },
        },
        {
          name: 'excludeServicesPrice',
          type: 'number',
          label: 'Exclude Services Price (EGP)',
          admin: {
            readOnly: true,
            step: 0.01,
            description: 'Total price for additional services',
          },
        },
        {
          name: 'excludeServicesBreakdown',
          type: 'textarea',
          label: 'Services Breakdown',
          admin: {
            readOnly: true,
            description: 'Detailed breakdown of additional services',
          },
        },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      label: 'Status Pembayaran',
      options: [
        {
          label: 'Paid',
          value: 'PAID',
        },
        {
          label: 'Invoiced',
          value: 'INVOICED',
        },
      ],
      defaultValue: 'INVOICED',
    },
    // Terms of Service Agreement
    {
      name: 'acceptTerms',
      type: 'checkbox',
      required: true,
      label: 'Accept Terms of Service',
      admin: {
        description: 'Customer must accept terms and conditions to proceed with booking',
      },
    },
    {
      name: 'eventNotes',
      type: 'textarea',
      label: 'Catatan Acara',
      admin: {
        rows: 3,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Guard clause: return early if data is undefined
        if (!data) {
          return data
        }

        // Debug logging for phone number validation
        if (operation === 'create' && data.contactInfo) {
          console.log('Auditorium booking beforeChange - Phone numbers:', {
            egyptPhoneNumber: data.contactInfo.egyptPhoneNumber,
            whatsappNumber: data.contactInfo.whatsappNumber,
          })
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          // Send notification to group
          try {
            const existingBookings = await req.payload.find({
              collection: 'auditorium-bookings',
              where: {
                'eventDetails.eventDate': {
                  equals: doc.eventDetails.eventDate,
                },
              },
            })

            const isDouble = existingBookings.docs.length > 1

            const formattedDate = new Date(doc.eventDetails.eventDate).toLocaleDateString('id-ID', {
              timeZone: 'Africa/Cairo',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })

            const notificationMessage = `Ada yang mengisi form di tanggal ${formattedDate}, segera dicek.${isDouble ? ' (Double)' : ''}`

            const groupResult = await sendWhatsAppMessage(
              '120363027743621417',
              notificationMessage,
              'group',
            )

            if (groupResult.success) {
              console.log(`✅ Group notification sent for booking ${doc.id}`)
            } else {
              console.error(
                `❌ Group notification failed for booking ${doc.id}:`,
                groupResult.error,
              )
            }
          } catch (error) {
            console.error(`❌ Error sending group notification for booking ${doc.id}:`, error)
          }

          try {
            // Fetch settings to check if we should send a WhatsApp message
            const settings = await req.payload.findGlobal({
              slug: 'settings',
            })

            // Only send if the setting is enabled
            if (settings?.whatsapp?.sendConfirmation) {
              // Import WhatsApp API function
              const { sendAuditoriumConfirmationWhatsApp } = await import('../lib/whatsapp-api')

              // Convert PayloadCMS doc to form data format
              const bookingData = {
                fullName: doc.fullName,
                countryOfOrigin: doc.countryOfOrigin,
                eventDetails: {
                  eventName: doc.eventDetails.eventName,
                  eventDate: new Date(doc.eventDetails.eventDate),
                  eventTime: doc.eventDetails.eventTime,
                  eventEndTime: doc.eventDetails.eventEndTime,
                },
                contactInfo: {
                  egyptPhoneNumber: doc.contactInfo.egyptPhoneNumber,
                  whatsappNumber: doc.contactInfo.whatsappNumber,
                },
                excludeServices: doc.excludeServices || {
                  airConditioner: 'none',
                  extraChairs: 'none',
                  projector: 'none',
                  extraTables: 'none',
                  plates: 'none',
                  glasses: 'none',
                },
                couponCode: doc.couponCode || '',
                eventNotes: doc.eventNotes || '',
                acceptTerms: doc.acceptTerms || false,
              }

              console.log('Booking data', bookingData)

              // Send WhatsApp confirmation with PDF
              console.log(`Sending WhatsApp confirmation for auditorium booking ${doc.id}`)
              const result = await sendAuditoriumConfirmationWhatsApp(bookingData, doc.id)

              if (result.success) {
                console.log(`✅ WhatsApp confirmation sent successfully for booking ${doc.id}`)
              } else {
                console.error(
                  `❌ WhatsApp confirmation failed for booking ${doc.id}:`,
                  result.error,
                )
              }
            } else {
              console.log(`WhatsApp confirmation skipped for booking ${doc.id} due to settings.`)
            }
          } catch (error) {
            // Silently handle errors to not break booking creation
            console.error(`❌ Error in afterChange hook for booking ${doc.id}:`, error)
          }
        }
      },
    ],
  },
  timestamps: true,
}
