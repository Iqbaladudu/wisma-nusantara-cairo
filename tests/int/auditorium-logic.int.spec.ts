import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload

describe('Auditorium Booking Logic', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  }, 60000)

  it('should enforce server-side price calculation', async () => {
    // 10:00 - 11:00 (1 hour) -> Base Price 115
    const booking = await payload.create({
      collection: 'auditorium-bookings',
      data: {
        fullName: 'Test Price Hacker',
        countryOfOrigin: 'Testland',
        eventDetails: {
          eventName: 'Hacking Price',
          eventDate: new Date().toISOString(), // Today
          eventTime: '10:00',
          eventEndTime: '11:00',
        },
        contactInfo: {
          egyptPhoneNumber: '01012345678',
          whatsappNumber: '+201012345678',
        },
        // Malicious payload: trying to set price to 0
        pricing: {
            basePrice: 0,
            excludeServicesPrice: 0,
            finalPrice: 0,
            priceBreakdown: 'Hacked',
        } as any, 
        excludeServices: {
            airConditioner: 'none',
            extraChairs: 'none',
            projector: 'none',
            extraTables: 'none',
            plates: 'none',
            glasses: 'none',
        },
        paymentStatus: 'INVOICED',
        acceptTerms: true,
      },
      overrideAccess: true, // Bypass access control to simulate API
    })

    // Expect price to be recalculated to 115
    expect(booking.pricing.finalPrice).toBe(115)
    expect(booking.pricing.basePrice).toBe(115)
    
    // Cleanup
    await payload.delete({
        collection: 'auditorium-bookings',
        id: booking.id
    })
  }, 30000)

  it('should prevent overlapping bookings', async () => {
     const today = new Date()
     today.setDate(today.getDate() + 1) // Tomorrow to avoid conflict with other tests
     const dateStr = today.toISOString()

     // Create first booking 13:00 - 15:00
     const booking1 = await payload.create({
      collection: 'auditorium-bookings',
      data: {
        fullName: 'Booking A',
        countryOfOrigin: 'Test',
        eventDetails: {
          eventName: 'Event A',
          eventDate: dateStr,
          eventTime: '13:00',
          eventEndTime: '15:00',
        },
        contactInfo: {
          egyptPhoneNumber: '01012345678',
          whatsappNumber: '+201012345678',
        },
        pricing: { finalPrice: 0 } as any, // Will be recalc
        excludeServices: {
            airConditioner: 'none',
            extraChairs: 'none',
            projector: 'none',
            extraTables: 'none',
            plates: 'none',
            glasses: 'none',
        },
        paymentStatus: 'INVOICED',
        acceptTerms: true,
      },
    })

    // Try to create overlapping booking 14:00 - 16:00
    try {
        await payload.create({
            collection: 'auditorium-bookings',
            data: {
              fullName: 'Booking B',
              countryOfOrigin: 'Test',
              eventDetails: {
                eventName: 'Event B',
                eventDate: dateStr,
                eventTime: '14:00', // Overlaps
                eventEndTime: '16:00',
              },
              contactInfo: {
                egyptPhoneNumber: '01012345678',
                whatsappNumber: '+201012345678',
              },
              pricing: { finalPrice: 0 } as any,
                excludeServices: {
                    airConditioner: 'none',
                    extraChairs: 'none',
                    projector: 'none',
                    extraTables: 'none',
                    plates: 'none',
                    glasses: 'none',
                },
              paymentStatus: 'INVOICED',
              acceptTerms: true,
            },
          })
          expect.fail('Should have thrown an error for overlapping booking')
    } catch (error: any) {
        expect(error.message).toContain('Booking Conflict')
    }

    // Cleanup
    await payload.delete({ collection: 'auditorium-bookings', id: booking1.id })
  }, 30000)

  it('should allow non-overlapping bookings on same day', async () => {
    const today = new Date()
    today.setDate(today.getDate() + 2) 
    const dateStr = today.toISOString()

    // 08:00 - 10:00
    const booking1 = await payload.create({
        collection: 'auditorium-bookings',
        data: {
          fullName: 'Booking C',
          countryOfOrigin: 'Test',
          eventDetails: {
            eventName: 'Event C',
            eventDate: dateStr,
            eventTime: '08:00',
            eventEndTime: '10:00',
          },
          contactInfo: {
            egyptPhoneNumber: '01012345678',
            whatsappNumber: '+201012345678',
          },
          pricing: { finalPrice: 0 } as any,
          excludeServices: {
            airConditioner: 'none',
            extraChairs: 'none',
            projector: 'none',
            extraTables: 'none',
            plates: 'none',
            glasses: 'none',
        },
        paymentStatus: 'INVOICED',
          acceptTerms: true,
        },
      })
      
      // 10:00 - 12:00 (Starts when previous ends)
      const booking2 = await payload.create({
        collection: 'auditorium-bookings',
        data: {
          fullName: 'Booking D',
          countryOfOrigin: 'Test',
          eventDetails: {
            eventName: 'Event D',
            eventDate: dateStr,
            eventTime: '10:00',
            eventEndTime: '12:00',
          },
          contactInfo: {
            egyptPhoneNumber: '01012345678',
            whatsappNumber: '+201012345678',
          },
          pricing: { finalPrice: 0 } as any,
          excludeServices: {
            airConditioner: 'none',
            extraChairs: 'none',
            projector: 'none',
            extraTables: 'none',
            plates: 'none',
            glasses: 'none',
        },
        paymentStatus: 'INVOICED',
          acceptTerms: true,
        },
      })

      expect(booking1).toBeDefined()
      expect(booking2).toBeDefined()

      // Cleanup
      await payload.delete({ collection: 'auditorium-bookings', id: booking1.id })
      await payload.delete({ collection: 'auditorium-bookings', id: booking2.id })
  }, 30000)
})
