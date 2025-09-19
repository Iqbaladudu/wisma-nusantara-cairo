import type { CollectionConfig } from 'payload'

export const HostelBookings: CollectionConfig = {
  slug: 'hostel-bookings',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: [
      'fullName',
      'checkInDate',
      'checkOutDate',
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
      name: 'passportNumber',
      type: 'text',
      required: true,
      label: 'Nomor Paspor',
      validate: (val: any) => {
        if (!val || val.length < 6) {
          return 'Passport number must be at least 6 characters'
        }
        return true
      },
    },
    {
      name: 'roomSelection',
      type: 'group',
      label: 'Room Selection',
      admin: {
        description: 'Select multiple room types with quantities',
      },
      fields: [
        {
          name: 'singleBed',
          type: 'number',
          required: true,
          defaultValue: 0,
          label: 'Single Bed',
          admin: {
            description: 'Single bed rooms',
          },
        },
        {
          name: 'doubleBed',
          type: 'number',
          required: true,
          defaultValue: 0,
          label: 'Double Bed',
          admin: {
            description: 'Double bed rooms',
          },
        },
        {
          name: 'extraBed',
          type: 'number',
          required: true,
          defaultValue: 0,
          label: 'Extra Bed',
          admin: {
            description: 'Extra beds',
          },
        },
      ],
    },
    {
      name: 'guestDetails',
      type: 'group',
      label: 'Detail Tamu',
      fields: [
        {
          name: 'adults',
          type: 'number',
          required: true,
          min: 1,
          max: 40,
          label: 'Jumlah Orang Dewasa',
          defaultValue: 1,
        },
        {
          name: 'children',
          type: 'number',
          required: true,
          min: 0,
          max: 40,
          label: 'Jumlah Anak-anak',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'stayDuration',
      type: 'group',
      label: 'Durasi Menginap',
      fields: [
        {
          name: 'checkInDate',
          type: 'date',
          required: true,
          label: 'Tanggal Check-in',
          validate: (val: any) => {
            if (!val) return true
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            if (new Date(val) < today) {
              return 'Check-in date cannot be in the past'
            }
            return true
          },
        },
        {
          name: 'checkOutDate',
          type: 'date',
          required: true,
          label: 'Tanggal Check-out',
          validate: (val: any, { data }: any) => {
            if (!val) return true
            if (
              data?.stayDuration?.checkInDate &&
              new Date(val) <= new Date(data.stayDuration.checkInDate)
            ) {
              return 'Check-out date must be after check-in date'
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
        {
          name: 'phoneNumber',
          type: 'text',
          required: true,
          label: 'Nomor Telepon',
          validate: (val: any) => {
            const phoneRegex = /^\+?[1-9]\d{1,14}$/
            if (!phoneRegex.test(val)) {
              return 'Please enter a valid phone number'
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
    // Airport Pickup Service
    {
      name: 'airportPickup',
      type: 'select',
      label: 'Airport Pickup',
      admin: {
        description: 'Optional airport pickup service',
      },
      options: [
        {
          label: 'No, thanks',
          value: 'none',
        },
        {
          label: 'Medium private vehicle (2-4 pax) [35 USD]',
          value: 'medium_vehicle',
        },
        {
          label: 'Hiace (up to 10pax + luggage) [50 USD]',
          value: 'hiace',
        },
      ],
      defaultValue: 'none',
    },
    {
      name: 'departureDateTime',
      type: 'group',
      label: 'Tanggal dan Waktu Berangkat',
      admin: {
        description: 'Optional departure date and time for airport pickup',
        condition: (data: any) => data.airportPickup !== 'none',
      },
      fields: [
        {
          name: 'departureDate',
          type: 'date',
          label: 'Tanggal Berangkat',
        },
        {
          name: 'departureTime',
          type: 'text',
          label: 'Waktu Berangkat',
          admin: {
            description: 'Format: HH:MM (24-hour format)',
          },
          validate: (val: any) => {
            if (!val) return true
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
            if (!timeRegex.test(val)) {
              return 'Please enter time in HH:MM format (24-hour)'
            }
            return true
          },
        },
      ],
    },
    // Meal Options
    {
      name: 'mealOptions',
      type: 'group',
      label: 'Meal Options',
      admin: {
        description: 'Optional meal packages',
      },
      fields: [
        // Breakfast Options
        {
          name: 'breakfastOption',
          type: 'select',
          label: 'Non-complimentary Breakfast',
          options: [
            {
              label: 'No Thanks',
              value: 'none',
            },
            {
              label: 'Paket Nasi Goreng 100 EGP/PAX [Minimal 4 pax]',
              value: 'nasi_goreng',
            },
            {
              label: 'Paket Ayam Goreng 120 EGP/PAX [Minimal 4 pax]',
              value: 'ayam_goreng',
            },
            {
              label: 'Paket Nasi Kuning 130 EGP/PAX [Minimal 10pax]',
              value: 'nasi_kuning',
            },
          ],
          defaultValue: 'none',
        },
        {
          name: 'breakfastPortions',
          type: 'number',
          label: 'Jumlah Porsi Breakfast',
          min: 0,
          admin: {
            condition: (data: any) => data.mealOptions?.breakfastOption !== 'none',
          },
        },
        {
          name: 'breakfastFrequency',
          type: 'select',
          label: 'Frekuensi Pemesanan Breakfast',
          options: [
            {
              label: 'Hanya saat check-in',
              value: 'checkin_only',
            },
            {
              label: 'Selama menginap',
              value: 'during_stay',
            },
            {
              label: 'Hanya saat akan check-out',
              value: 'checkout_only',
            },
          ],
          admin: {
            condition: (data: any) => data.mealOptions?.breakfastOption !== 'none',
          },
        },
        // Lunch Options
        {
          name: 'lunchOption',
          type: 'select',
          label: 'Paid Lunch Option',
          options: [
            {
              label: 'No thanks',
              value: 'none',
            },
            {
              label: 'Paket Nasi Goreng 100 EGP/PAX [Minimal 4 pax]',
              value: 'nasi_goreng',
            },
            {
              label: 'Paket Ayam Goreng 120 EGP/PAX [Minimal 4 pax]',
              value: 'ayam_goreng',
            },
            {
              label: 'Paket Nasi Kuning 130 EGP/PAX [Minimal 10pax]',
              value: 'nasi_kuning',
            },
          ],
          defaultValue: 'none',
        },
        {
          name: 'lunchPortions',
          type: 'number',
          label: 'Jumlah Porsi Lunch',
          min: 0,
          admin: {
            condition: (data: any) => data.mealOptions?.lunchOption !== 'none',
          },
        },
        {
          name: 'lunchFrequency',
          type: 'select',
          label: 'Frekuensi Pemesanan Lunch',
          options: [
            {
              label: 'Hanya saat check-in',
              value: 'checkin_only',
            },
            {
              label: 'Selama menginap',
              value: 'during_stay',
            },
            {
              label: 'Hanya saat akan check-out',
              value: 'checkout_only',
            },
          ],
          admin: {
            condition: (data: any) => data.mealOptions?.lunchOption !== 'none',
          },
        },
        // Dinner Options
        {
          name: 'dinnerOption',
          type: 'select',
          label: 'Paid Dinner Option',
          options: [
            {
              label: 'No thanks',
              value: 'none',
            },
            {
              label: 'Paket Nasi Goreng 100 EGP/PAX [Minimal 4 pax]',
              value: 'nasi_goreng',
            },
            {
              label: 'Paket Ayam Goreng 120 EGP/PAX [Minimal 4 pax]',
              value: 'ayam_goreng',
            },
            {
              label: 'Paket Nasi Kuning 130 EGP/PAX [Minimal 10pax]',
              value: 'nasi_kuning',
            },
          ],
          defaultValue: 'none',
        },
        {
          name: 'dinnerPortions',
          type: 'number',
          label: 'Jumlah Porsi Dinner',
          min: 0,
          admin: {
            condition: (data: any) => data.mealOptions?.dinnerOption !== 'none',
          },
        },
        {
          name: 'dinnerFrequency',
          type: 'select',
          label: 'Frekuensi Pemesanan Dinner',
          options: [
            {
              label: 'Hanya saat check-in',
              value: 'checkin_only',
            },
            {
              label: 'Selama menginap',
              value: 'during_stay',
            },
            {
              label: 'Hanya saat akan check-out',
              value: 'checkout_only',
            },
          ],
          admin: {
            condition: (data: any) => data.mealOptions?.dinnerOption !== 'none',
          },
        },
      ],
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
      name: 'price',
      type: 'number',
      label: 'Price (USD)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      label: 'Status Pembayaran',
      options: [
        {
          label: 'Lunas',
          value: 'PAID',
        },
        {
          label: 'Uang Muka',
          value: 'DOWNPAYMENT',
        },
        {
          label: 'Menunggu Pembayaran',
          value: 'INVOICED',
        },
      ],
      defaultValue: 'INVOICED',
    },
    {
      name: 'bookingNotes',
      type: 'textarea',
      label: 'Catatan Booking',
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

        // Calculate pricing based on new structure
        if (operation === 'create' || operation === 'update') {
          const singleBedCost = (data.roomSelection?.singleBed || 0) * 30
          const doubleBedCost = (data.roomSelection?.doubleBed || 0) * 35
          const extraBedCost = (data.roomSelection?.extraBed || 0) * 10

          const totalCostPerNight = singleBedCost + doubleBedCost + extraBedCost

          // Calculate total nights if dates are available
          if (data.stayDuration?.checkInDate && data.stayDuration?.checkOutDate) {
            const checkIn = new Date(data.stayDuration.checkInDate)
            const checkOut = new Date(data.stayDuration.checkOutDate)
            const timeDiff = checkOut.getTime() - checkIn.getTime()
            const numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24))
            const totalCost = totalCostPerNight * numberOfNights

            data.price = totalCost
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          try {
            // Fetch settings to check if we should send a WhatsApp message
            const settings = await req.payload.findGlobal({
              slug: 'settings',
            })

            // Only send if the setting is enabled
            if (settings?.whatsapp?.sendConfirmation) {
              // Import WhatsApp API function
              const { sendHostelConfirmationWhatsApp } = await import('../lib/whatsapp-api')

              // Convert PayloadCMS doc to form data format
              const bookingData = {
                fullName: doc.fullName,
                countryOfOrigin: doc.countryOfOrigin,
                passportNumber: doc.passportNumber,
                roomSelection: {
                  singleBed: doc.roomSelection?.singleBed || 0,
                  doubleBed: doc.roomSelection?.doubleBed || 0,
                  extraBed: doc.roomSelection?.extraBed || 0,
                },
                guestDetails: {
                  adults: doc.guestDetails?.adults || 1,
                  children: doc.guestDetails?.children || 0,
                },
                stayDuration: {
                  checkInDate: new Date(doc.stayDuration.checkInDate),
                  checkOutDate: new Date(doc.stayDuration.checkOutDate),
                },
                contactInfo: {
                  whatsappNumber: doc.contactInfo.whatsappNumber,
                  phoneNumber: doc.contactInfo.phoneNumber,
                },
                couponCode: doc.couponCode || '',
                airportPickup: doc.airportPickup || 'none',
                departureDateTime: doc.departureDateTime || {},
                mealOptions: doc.mealOptions || {},
                additionalServices: doc.additionalServices || {},
                acceptTerms: doc.acceptTerms || false,
              }

              // Send WhatsApp confirmation with PDF
              console.log(`Sending WhatsApp confirmation for hostel booking ${doc.id}`)
              await sendHostelConfirmationWhatsApp(bookingData, doc.id)
              console.log(`✅ WhatsApp confirmation sent successfully for booking ${doc.id}`)
            } else {
              console.log(`WhatsApp confirmation skipped for booking ${doc.id} due to settings.`)
            }
          } catch (error) {
            // Silently handle WhatsApp errors to not break booking creation
            console.error(`❌ WhatsApp confirmation error for booking ${doc.id}:`, error)
          }
        }
      },
    ],
  },
  timestamps: true,
}
