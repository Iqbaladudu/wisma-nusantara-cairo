import type { CollectionConfig } from 'payload'

export const PricingConfig: CollectionConfig = {
  slug: 'pricing-config',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'basePrice', 'isActive', 'updatedAt'],
    group: 'Configuration',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Pricing Name',
      admin: {
        description: 'Descriptive name for this pricing configuration',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Pricing Type',
      options: [
        {
          label: 'Hostel - Per Person Per Night',
          value: 'hostel_per_person',
        },
        {
          label: 'Hostel - Per Room Per Night',
          value: 'hostel_per_room',
        },
        {
          label: 'Hall - Per Hour',
          value: 'hall_per_hour',
        },
        {
          label: 'Hall - Per Day',
          value: 'hall_per_day',
        },
        {
          label: 'Hall - Per Event',
          value: 'hall_per_event',
        },
      ],
    },
    {
      name: 'basePrice',
      type: 'number',
      required: true,
      min: 0,
      label: 'Base Price (EGP)',
      admin: {
        step: 0.01,
        description: 'Base price in Egyptian Pounds',
      },
    },
    {
      name: 'seasonalMultipliers',
      type: 'array',
      label: 'Seasonal Price Multipliers',
      admin: {
        description: 'Define different pricing for different seasons/periods',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Season Name',
        },
        {
          name: 'startDate',
          type: 'date',
          required: true,
          label: 'Start Date',
        },
        {
          name: 'endDate',
          type: 'date',
          required: true,
          label: 'End Date',
        },
        {
          name: 'multiplier',
          type: 'number',
          required: true,
          min: 0.1,
          max: 10,
          label: 'Price Multiplier',
          admin: {
            step: 0.1,
            description: 'Multiply base price by this value (e.g., 1.5 = 50% increase)',
          },
        },
        {
          name: 'isActive',
          type: 'checkbox',
          label: 'Active',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'weekendMultiplier',
      type: 'number',
      label: 'Weekend Multiplier',
      defaultValue: 1,
      min: 0.1,
      max: 10,
      admin: {
        step: 0.1,
        description: 'Additional multiplier for weekends (Friday & Saturday)',
      },
    },
    {
      name: 'minimumStay',
      type: 'number',
      label: 'Minimum Stay (nights)',
      defaultValue: 1,
      min: 1,
      admin: {
        condition: (data) => data.type?.includes('hostel'),
        description: 'Minimum number of nights for hostel bookings',
      },
    },
    {
      name: 'maximumCapacity',
      type: 'number',
      label: 'Maximum Capacity',
      admin: {
        description: 'Maximum number of people/guests for this pricing tier',
      },
    },
    {
      name: 'additionalGuestFee',
      type: 'number',
      label: 'Additional Guest Fee (EGP)',
      defaultValue: 0,
      min: 0,
      admin: {
        step: 0.01,
        condition: (data) => data.type?.includes('hostel'),
        description: 'Extra fee per additional guest beyond base capacity',
      },
    },
    {
      name: 'childDiscount',
      type: 'number',
      label: 'Child Discount (%)',
      defaultValue: 0,
      min: 0,
      max: 100,
      admin: {
        condition: (data) => data.type?.includes('hostel'),
        description: 'Percentage discount for children',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        description: 'Whether this pricing configuration is currently active',
      },
    },
    {
      name: 'validFrom',
      type: 'date',
      label: 'Valid From',
      admin: {
        description: 'Date from which this pricing becomes effective',
      },
    },
    {
      name: 'validUntil',
      type: 'date',
      label: 'Valid Until',
      admin: {
        description: 'Date until which this pricing remains effective',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Additional notes about this pricing configuration',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Guard clause: return early if data is undefined
        if (!data) {
          return data
        }

        // Ensure valid date ranges for seasonal multipliers
        if (data.seasonalMultipliers) {
          data.seasonalMultipliers.forEach((season: any) => {
            if (season.startDate && season.endDate) {
              if (new Date(season.endDate) <= new Date(season.startDate)) {
                throw new Error(`Season "${season.name}": End date must be after start date`)
              }
            }
          })
        }

        // Ensure valid date range for pricing validity
        if (data.validFrom && data.validUntil) {
          if (new Date(data.validUntil) <= new Date(data.validFrom)) {
            throw new Error('Valid Until date must be after Valid From date')
          }
        }

        return data
      },
    ],
  },
  timestamps: true,
}
