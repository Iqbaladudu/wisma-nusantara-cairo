import type { CollectionConfig } from 'payload'

export const AuditoriumBooking: CollectionConfig = {
  slug: 'auditorium-bookings',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'eventDate', 'eventTime', 'paymentStatus', 'createdAt'],
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
          label: 'Waktu Acara',
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
            // Egyptian phone number validation
            const egyptPhoneRegex = /^(\+20|0)?1[0125]\d{8}$/
            if (!egyptPhoneRegex.test(val.replace(/\s/g, ''))) {
              return 'Please enter a valid Egyptian phone number'
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
            const phoneRegex = /^\+?[1-9]\d{1,14}$/
            if (!phoneRegex.test(val)) {
              return 'Please enter a valid WhatsApp number'
            }
            return true
          },
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
      async ({ data }) => {
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          try {
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
              },
              contactInfo: {
                egyptPhoneNumber: doc.contactInfo.egyptPhoneNumber,
                whatsappNumber: doc.contactInfo.whatsappNumber,
              },
              couponCode: doc.couponCode || '',
              eventNotes: doc.eventNotes || '',
            }

            // Send WhatsApp confirmation with PDF
            await sendAuditoriumConfirmationWhatsApp(bookingData, doc.id)
          } catch (error) {
            // Silently handle WhatsApp errors to not break booking creation
          }
        }
      },
    ],
  },
  timestamps: true,
}
