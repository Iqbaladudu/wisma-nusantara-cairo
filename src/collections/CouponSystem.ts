import type { CollectionConfig } from 'payload'

export const CouponSystem: CollectionConfig = {
  slug: 'coupons',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'type', 'discountValue', 'isActive', 'usageCount', 'validUntil'],
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
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Coupon Code',
      admin: {
        description: 'Unique coupon code (will be converted to uppercase)',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Coupon Name',
      admin: {
        description: 'Descriptive name for this coupon',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Description of what this coupon offers',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Discount Type',
      options: [
        {
          label: 'Percentage Discount',
          value: 'percentage',
        },
        {
          label: 'Fixed Amount Discount',
          value: 'fixed',
        },
        {
          label: 'Free Nights (Hostel)',
          value: 'free_nights',
        },
        {
          label: 'Free Hours (Hall)',
          value: 'free_hours',
        },
      ],
    },
    {
      name: 'discountValue',
      type: 'number',
      required: true,
      min: 0,
      label: 'Discount Value',
      admin: {
        step: 0.01,
        description: 'Percentage (0-100) or fixed amount in EGP or number of free nights/hours',
      },
    },
    {
      name: 'maxDiscountAmount',
      type: 'number',
      label: 'Maximum Discount Amount (EGP)',
      min: 0,
      admin: {
        step: 0.01,
        condition: (data) => data.type === 'percentage',
        description: 'Maximum discount amount for percentage-based coupons',
      },
    },
    {
      name: 'minimumOrderAmount',
      type: 'number',
      label: 'Minimum Order Amount (EGP)',
      defaultValue: 0,
      min: 0,
      admin: {
        step: 0.01,
        description: 'Minimum booking amount required to use this coupon',
      },
    },
    {
      name: 'applicableServices',
      type: 'select',
      required: true,
      label: 'Applicable Services',
      hasMany: true,
      options: [
        {
          label: 'Hostel Bookings',
          value: 'hostel',
        },
        {
          label: 'Hall Bookings',
          value: 'hall',
        },
      ],
      defaultValue: ['hostel', 'hall'],
    },
    {
      name: 'usageLimit',
      type: 'number',
      label: 'Usage Limit',
      min: 1,
      admin: {
        description: 'Maximum number of times this coupon can be used (leave empty for unlimited)',
      },
    },
    {
      name: 'usageCount',
      type: 'number',
      label: 'Current Usage Count',
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
        description: 'Number of times this coupon has been used',
      },
    },
    {
      name: 'perUserLimit',
      type: 'number',
      label: 'Per User Limit',
      min: 1,
      admin: {
        description: 'Maximum times a single user can use this coupon (leave empty for unlimited)',
      },
    },
    {
      name: 'validFrom',
      type: 'date',
      label: 'Valid From',
      admin: {
        description: 'Date from which this coupon becomes valid',
      },
    },
    {
      name: 'validUntil',
      type: 'date',
      label: 'Valid Until',
      admin: {
        description: 'Date until which this coupon remains valid',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        description: 'Whether this coupon is currently active',
      },
    },
    {
      name: 'isFirstTimeOnly',
      type: 'checkbox',
      label: 'First Time Users Only',
      defaultValue: false,
      admin: {
        description: 'Restrict this coupon to first-time users only',
      },
    },
    {
      name: 'excludeWeekends',
      type: 'checkbox',
      label: 'Exclude Weekends',
      defaultValue: false,
      admin: {
        description: 'Prevent usage on weekends (Friday & Saturday)',
      },
    },
    {
      name: 'allowedCountries',
      type: 'array',
      label: 'Allowed Countries',
      admin: {
        description: 'Restrict coupon usage to specific countries (leave empty for all countries)',
      },
      fields: [
        {
          name: 'country',
          type: 'text',
          required: true,
          label: 'Country Name',
        },
      ],
    },
    {
      name: 'usageHistory',
      type: 'array',
      label: 'Usage History',
      admin: {
        readOnly: true,
        description: 'History of coupon usage',
      },
      fields: [
        {
          name: 'bookingId',
          type: 'text',
          label: 'Booking ID',
        },
        {
          name: 'bookingType',
          type: 'select',
          options: [
            { label: 'Hostel', value: 'hostel' },
            { label: 'Hall', value: 'hall' },
          ],
        },
        {
          name: 'customerName',
          type: 'text',
          label: 'Customer Name',
        },
        {
          name: 'discountApplied',
          type: 'number',
          label: 'Discount Applied (EGP)',
        },
        {
          name: 'usedAt',
          type: 'date',
          label: 'Used At',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Guard clause: return early if data is undefined
        if (!data) {
          return data
        }

        // Convert coupon code to uppercase
        if (data.code) {
          data.code = data.code.toUpperCase().replace(/\s+/g, '')
        }

        // Validate discount value based on type
        if (data.type === 'percentage' && data.discountValue > 100) {
          throw new Error('Percentage discount cannot exceed 100%')
        }

        // Ensure valid date range
        if (data.validFrom && data.validUntil) {
          if (new Date(data.validUntil) <= new Date(data.validFrom)) {
            throw new Error('Valid Until date must be after Valid From date')
          }
        }

        // Check usage limit
        if (data.usageLimit && data.usageCount >= data.usageLimit) {
          data.isActive = false
        }

        return data
      },
    ],
    beforeValidate: [
      ({ data }) => {
        // Guard clause: return early if data is undefined
        if (!data) {
          return data
        }

        // Validate required fields based on type
        if (data.type === 'percentage' && (data.discountValue < 0 || data.discountValue > 100)) {
          throw new Error('Percentage discount must be between 0 and 100')
        }

        if (
          (data.type === 'fixed' || data.type === 'free_nights' || data.type === 'free_hours') &&
          data.discountValue <= 0
        ) {
          throw new Error('Discount value must be greater than 0')
        }

        return data
      },
    ],
  },
  timestamps: true,
}
