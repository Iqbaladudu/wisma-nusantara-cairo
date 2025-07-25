import type { Payload } from 'payload'

export const seedSampleData = async (payload: Payload) => {
  console.log('🌱 Starting to seed sample data...')

  try {
    // 1. Create Admin User
    console.log('👤 Creating admin user...')
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@wismanusantara.com',
        password: 'admin123',
      },
    })
    console.log('✅ Admin user created:', adminUser.email)

    // 2. Create Pricing Configurations
    console.log('💰 Creating pricing configurations...')
    
    // Hostel pricing
    const hostelPricing = await payload.create({
      collection: 'pricing-config',
      data: {
        name: 'Standard Hostel Room',
        type: 'hostel_per_person',
        basePrice: 25.00, // USD per person per night
        seasonalMultipliers: [
          {
            name: 'High Season (Dec-Feb)',
            startDate: '2024-12-01',
            endDate: '2025-02-28',
            multiplier: 1.3,
            isActive: true,
          },
          {
            name: 'Ramadan Season',
            startDate: '2024-03-10',
            endDate: '2024-04-09',
            multiplier: 1.2,
            isActive: true,
          },
        ],
        weekendMultiplier: 1.15,
        childDiscount: 0.5, // 50% discount for children
        extraBedPrice: 15.00,
        currency: 'USD',
        isActive: true,
        validFrom: '2024-01-01',
        validUntil: '2025-12-31',
        description: 'Standard hostel accommodation pricing per person per night',
      },
    })

    // Hall pricing
    const hallPricing = await payload.create({
      collection: 'pricing-config',
      data: {
        name: 'Main Auditorium',
        type: 'hall_per_hour',
        basePrice: 50.00, // USD per hour
        seasonalMultipliers: [
          {
            name: 'Peak Event Season',
            startDate: '2024-09-01',
            endDate: '2024-11-30',
            multiplier: 1.25,
            isActive: true,
          },
        ],
        weekendMultiplier: 1.2,
        currency: 'USD',
        isActive: true,
        validFrom: '2024-01-01',
        validUntil: '2025-12-31',
        description: 'Main auditorium rental pricing per hour',
      },
    })

    console.log('✅ Pricing configurations created')

    // 3. Create Sample Coupons
    console.log('🎫 Creating sample coupons...')
    
    const coupons = [
      {
        code: 'WELCOME10',
        name: 'Welcome Discount',
        description: '10% discount for new customers',
        type: 'percentage',
        discountValue: 10,
        maxUsage: 100,
        usageCount: 0,
        isActive: true,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        applicableServices: ['hostel', 'hall'],
        minimumAmount: 50,
      },
      {
        code: 'RAMADAN2024',
        name: 'Ramadan Special',
        description: 'Fixed $20 discount for Ramadan season',
        type: 'fixed',
        discountValue: 20,
        maxUsage: 50,
        usageCount: 0,
        isActive: true,
        validFrom: '2024-03-01',
        validUntil: '2024-04-30',
        applicableServices: ['hostel', 'hall'],
        minimumAmount: 100,
      },
      {
        code: 'STUDENT20',
        name: 'Student Discount',
        description: '20% discount for students (weekdays only)',
        type: 'percentage',
        discountValue: 20,
        maxUsage: 200,
        usageCount: 0,
        isActive: true,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        applicableServices: ['hostel'],
        minimumAmount: 30,
        excludeWeekends: true,
      },
      {
        code: 'FREENIGHT',
        name: 'Free Night Special',
        description: 'Get 1 free night when booking 3+ nights',
        type: 'free_nights',
        discountValue: 1,
        maxUsage: 30,
        usageCount: 0,
        isActive: true,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        applicableServices: ['hostel'],
        minimumNights: 3,
      },
      {
        code: 'EARLYBIRD',
        name: 'Early Bird Discount',
        description: '15% discount for bookings made 30 days in advance',
        type: 'percentage',
        discountValue: 15,
        maxUsage: 75,
        usageCount: 0,
        isActive: true,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        applicableServices: ['hostel', 'hall'],
        minimumAdvanceBookingDays: 30,
      },
    ]

    for (const couponData of coupons) {
      await payload.create({
        collection: 'coupons',
        data: couponData,
      })
    }

    console.log('✅ Sample coupons created')

    // 4. Create Sample Hostel Bookings
    console.log('🏨 Creating sample hostel bookings...')
    
    const hostelBookings = [
      {
        fullName: 'Ahmad Rizki Pratama',
        countryOfOrigin: 'Indonesia',
        passportNumber: 'A1234567',
        roomSelection: {
          singleBed: 1,
          doubleBed: 0,
          extraBed: 0,
        },
        guestDetails: {
          adults: 1,
          children: 0,
        },
        stayDuration: {
          checkInDate: '2024-02-15',
          checkOutDate: '2024-02-20',
        },
        contactInfo: {
          whatsappNumber: '+6281234567890',
          phoneNumber: '+6281234567890',
        },
        additionalServices: [],
        specialRequests: 'Halal food preferred',
        paymentStatus: 'PAID',
        bookingNotes: 'Student from University of Indonesia',
      },
      {
        fullName: 'Siti Nurhaliza',
        countryOfOrigin: 'Malaysia',
        passportNumber: 'M9876543',
        roomSelection: {
          singleBed: 0,
          doubleBed: 1,
          extraBed: 1,
        },
        guestDetails: {
          adults: 2,
          children: 1,
        },
        stayDuration: {
          checkInDate: '2024-03-01',
          checkOutDate: '2024-03-07',
        },
        contactInfo: {
          whatsappNumber: '+60123456789',
          phoneNumber: '+60123456789',
        },
        additionalServices: ['airport_pickup'],
        specialRequests: 'Family room with connecting door if available',
        paymentStatus: 'DOWNPAYMENT',
        bookingNotes: 'Family vacation, celebrating anniversary',
      },
    ]

    for (const bookingData of hostelBookings) {
      await payload.create({
        collection: 'hostel-bookings',
        data: bookingData,
      })
    }

    console.log('✅ Sample hostel bookings created')

    // 5. Create Sample Auditorium Bookings
    console.log('🎭 Creating sample auditorium bookings...')
    
    const auditoriumBookings = [
      {
        fullName: 'Dr. Budi Santoso',
        countryOfOrigin: 'Indonesia',
        passportNumber: 'B2468135',
        eventDate: '2024-03-15',
        eventTime: '14:00',
        eventDuration: 4, // hours
        eventType: 'conference',
        eventTitle: 'Indonesian Cultural Heritage Seminar',
        eventDescription: 'A seminar discussing the preservation of Indonesian cultural heritage in the modern era',
        expectedAttendees: 150,
        contactInfo: {
          whatsappNumber: '+6281987654321',
          phoneNumber: '+6281987654321',
        },
        additionalServices: ['catering', 'av_equipment'],
        specialRequests: 'Need projector and sound system for presentation',
        paymentStatus: 'INVOICED',
        bookingNotes: 'Academic conference organized by Indonesian Cultural Association',
      },
      {
        fullName: 'Fatimah Al-Zahra',
        countryOfOrigin: 'Egypt',
        passportNumber: 'E1357924',
        eventDate: '2024-04-20',
        eventTime: '19:00',
        eventDuration: 3,
        eventType: 'cultural',
        eventTitle: 'Ramadan Iftar Community Gathering',
        eventDescription: 'Community iftar event bringing together Indonesian and Arab communities in Cairo',
        expectedAttendees: 200,
        contactInfo: {
          whatsappNumber: '+201234567890',
          phoneNumber: '+201234567890',
        },
        additionalServices: ['catering', 'decoration'],
        specialRequests: 'Halal catering required, traditional decorations preferred',
        paymentStatus: 'PAID',
        bookingNotes: 'Annual community event, regular customer',
      },
    ]

    for (const bookingData of auditoriumBookings) {
      await payload.create({
        collection: 'auditorium-bookings',
        data: bookingData,
      })
    }

    console.log('✅ Sample auditorium bookings created')

    console.log('🎉 All sample data seeded successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    throw error
  }
}
