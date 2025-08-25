import { CollectionAfterChangeHook } from 'payload'

// Safe date parsing utility
export const safeParseDate = (dateValue: unknown, fallback: Date = new Date()): Date => {
  try {
    if (!dateValue) return fallback

    // If it's already a Date object
    if (dateValue instanceof Date) {
      // Check if it's a valid date
      if (isNaN(dateValue.getTime())) return fallback
      return dateValue
    }

    // If it's a string, try to parse it safely
    if (typeof dateValue === 'string') {
      // If it already has time component, use as is
      if (dateValue.includes('T')) {
        const parsed = new Date(dateValue)
        if (isNaN(parsed.getTime())) return fallback
        return parsed
      }
      // If it's just date, add UTC time
      const parsed = new Date(dateValue + 'T00:00:00.000Z')
      if (isNaN(parsed.getTime())) return fallback
      return parsed
    }

    // Try direct construction
    const parsed = new Date(dateValue as string | number)
    if (isNaN(parsed.getTime())) return fallback
    return parsed
  } catch (error) {
    console.error('Date parsing error:', error, 'for value:', dateValue)
    return fallback
  }
}

// Generate prefixed booking ID
export const generateBookingId = (type: 'hostel' | 'auditorium', originalId: string): string => {
  const prefix = type === 'hostel' ? 'HST' : 'AUD'
  return `${prefix}-${originalId}`
}

// Parse booking ID to get type and original ID
export const parseBookingId = (
  bookingId: string,
): { type: 'hostel' | 'auditorium' | 'unknown'; originalId: string } => {
  if (bookingId.startsWith('HST-')) {
    return { type: 'hostel', originalId: bookingId.substring(4) }
  } else if (bookingId.startsWith('AUD-')) {
    return { type: 'auditorium', originalId: bookingId.substring(4) }
  } else {
    // Legacy booking ID without prefix
    return { type: 'unknown', originalId: bookingId }
  }
}

// Collection hook to add display booking ID
export const addDisplayBookingId: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (operation === 'create') {
    const collectionSlug = req.collection?.config?.slug
    const type = collectionSlug === 'hostel-bookings' ? 'hostel' : 'auditorium'

    // Add display booking ID field
    const displayBookingId = generateBookingId(type, doc.id)

    try {
      await req.payload.update({
        collection: collectionSlug as 'hostel-bookings' | 'auditorium-bookings',
        id: doc.id,
        data: {
          displayBookingId,
        },
      })
    } catch (error) {
      console.error('Failed to update display booking ID:', error)
    }
  }

  return doc
}
