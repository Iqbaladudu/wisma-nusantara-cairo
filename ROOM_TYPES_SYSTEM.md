# Room Types & Enhanced Booking System

## Overview

Sistem room types yang terintegrasi dengan dynamic pricing untuk mengelola berbagai jenis kamar hostel dengan harga yang berbeda, termasuk opsi extra bed dan payment status yang dikelola di backend.

## New Features Implemented

### 1. Room Types Collection (`/admin/collections/room-types`)

**Core Fields:**
- `name`: Nama jenis kamar (e.g., "Single Bed Room", "Double Bed Room")
- `slug`: URL-friendly identifier
- `description`: Deskripsi detail kamar
- `basePrice`: Harga dasar per malam (EGP)
- `maxOccupancy`: Kapasitas maksimum tamu

**Bed Configuration:**
- `bedType`: Jenis kasur (single, double, twin, queen, king)
- `bedCount`: Jumlah kasur
- `allowExtraBed`: Apakah mengizinkan extra bed
- `extraBedPrice`: Harga extra bed per malam
- `maxExtraBeds`: Maksimum extra bed yang diizinkan

**Availability Settings:**
- `totalRooms`: Total kamar tersedia
- `isActive`: Status aktif untuk booking
- `minimumStay`: Minimum malam menginap
- `maximumStay`: Maksimum malam menginap

**Additional Features:**
- `amenities`: Array fasilitas kamar
- `images`: Gallery foto kamar
- `seasonalPricing`: Override harga untuk musim tertentu
- `sortOrder`: Urutan tampilan

### 2. Enhanced Hostel Booking Form

**New Room Selection Section:**
- **Room Type Dropdown**: Dinamis dari database dengan info harga dan kapasitas
- **Number of Rooms**: Input jumlah kamar (1-10)
- **Extra Beds**: Input jumlah extra bed yang dibutuhkan

**Removed Fields:**
- ❌ **Payment Status**: Sekarang dikelola di backend
- ❌ **Manual Pricing**: Harga dihitung otomatis

**Enhanced Features:**
- Real-time room type loading dengan loading states
- Detailed room information dalam dropdown (harga, kapasitas, extra bed info)
- Improved form validation dengan room-specific rules

### 3. Updated Pricing Calculation

**Room-Based Pricing Logic:**
```
Total Price = (Room Price × Rooms × Nights) + (Extra Bed Price × Extra Beds × Nights)
```

**Enhanced Calculation Factors:**
- Base room type price (from room-types collection)
- Number of rooms selected
- Extra bed pricing (if applicable)
- Seasonal multipliers (from pricing-config)
- Weekend multipliers
- Child discounts
- Coupon discounts

**Pricing Breakdown Storage:**
- `roomTypePrice`: Harga room type per malam
- `numberOfRooms`: Jumlah kamar
- `extraBedPrice`: Harga extra bed per malam
- `extraBedCount`: Jumlah extra bed
- Detailed JSON breakdown untuk transparency

### 4. Backend Integration

**PayloadCMS Hooks Enhancement:**
- Automatic room type data fetching
- Enhanced pricing calculation with room types
- Fallback to pricing config if room type not found
- Comprehensive error handling

**Database Schema Updates:**
- New `room_selection` group in hostel bookings
- Relationship to room-types collection
- Enhanced pricing structure
- Removed payment status from frontend forms

## Sample Room Types

### Single Bed Room
- **Price**: EGP 120/night
- **Capacity**: 1 guest
- **Extra Bed**: Available (+EGP 50/night)
- **Amenities**: AC, WiFi, Private Bathroom, Desk, Wardrobe

### Double Bed Room
- **Price**: EGP 180/night
- **Capacity**: 2 guests
- **Extra Bed**: Available (+EGP 60/night, max 2)
- **Amenities**: AC, WiFi, Private Bathroom, Desk, Wardrobe, Mini Fridge, Seating Area
- **Seasonal Pricing**: Ramadan Premium (EGP 220/night)

## Frontend Implementation

### useRoomTypes Hook
```typescript
const { roomTypes, loading, error, refetch } = useRoomTypes()
```

**Features:**
- Automatic fetching of active room types
- Loading states management
- Error handling
- Refetch capability
- Sorted by sortOrder field

### Enhanced Form Components
- Dynamic room type selection with rich information
- Real-time validation based on room capacity
- Loading states for better UX
- Responsive design for mobile/desktop

## API Integration

### Room Types API Endpoints
- `GET /api/room-types` - List all room types
- `GET /api/room-types?where[availability.isActive][equals]=true` - Active room types only
- `GET /api/room-types/{id}` - Get specific room type

### Enhanced Booking API
- Automatic room type data inclusion
- Enhanced pricing calculation
- Comprehensive validation
- Error handling with fallbacks

## Admin Interface

### Room Types Management
1. **Create/Edit Room Types**: Full CRUD operations
2. **Seasonal Pricing**: Override prices for specific periods
3. **Availability Management**: Control room availability
4. **Image Gallery**: Upload and manage room photos
5. **Amenities Management**: Add/remove room amenities

### Enhanced Booking Management
1. **Room Selection Display**: Clear room type information
2. **Pricing Breakdown**: Detailed cost calculation
3. **Automatic Calculations**: No manual pricing needed
4. **Payment Status**: Backend-controlled status

## Benefits

### For Administrators
✅ **Flexible Pricing**: Different prices for different room types
✅ **Seasonal Control**: Override prices for special periods
✅ **Extra Bed Management**: Automatic extra bed pricing
✅ **No Manual Pricing**: Eliminates pricing errors
✅ **Rich Room Information**: Detailed room descriptions and photos

### For Users
✅ **Clear Room Options**: Detailed room information with pricing
✅ **Transparent Pricing**: See exactly what you're paying for
✅ **Flexible Booking**: Choose rooms and extra beds as needed
✅ **Better UX**: Loading states and error handling

### For Developers
✅ **Type Safety**: Full TypeScript integration
✅ **Modular Design**: Reusable components and hooks
✅ **Error Handling**: Comprehensive error management
✅ **Scalable Architecture**: Easy to add new room types

## Migration Notes

### Database Changes
- New `room-types` collection created
- Enhanced `hostel-bookings` with room selection
- Updated pricing structure
- Removed payment status from frontend

### Form Changes
- Added room selection section
- Removed payment status input
- Enhanced validation rules
- Improved user experience

### API Changes
- New room types endpoints
- Enhanced pricing calculation
- Updated booking data structure
- Backward compatibility maintained

## Future Enhancements

1. **Room Availability Calendar**: Real-time availability checking
2. **Room Photos Gallery**: Enhanced image management
3. **Room Reviews**: Guest feedback system
4. **Dynamic Availability**: Integration with booking calendar
5. **Multi-language Support**: Room descriptions in multiple languages
6. **Room Comparison**: Side-by-side room comparison
7. **Virtual Tours**: 360° room views
8. **Booking Conflicts**: Prevent double bookings

## Testing

### Manual Testing Checklist
- [ ] Room types display correctly in dropdown
- [ ] Pricing calculates automatically with room selection
- [ ] Extra bed pricing works correctly
- [ ] Form validation prevents invalid selections
- [ ] Loading states work properly
- [ ] Error handling displays appropriate messages
- [ ] Admin interface allows room type management
- [ ] Booking creation works with room selection

### Automated Testing
- Unit tests for pricing calculations
- Integration tests for API endpoints
- Component tests for form interactions
- E2E tests for complete booking flow

## Conclusion

Sistem room types telah berhasil diimplementasikan dengan fitur-fitur lengkap untuk mengelola berbagai jenis kamar dengan harga yang berbeda. Payment status sekarang dikelola sepenuhnya di backend, dan pricing dihitung otomatis berdasarkan room type, extra beds, dan faktor-faktor lainnya. Sistem ini memberikan fleksibilitas tinggi untuk administrator dan pengalaman yang lebih baik untuk pengguna.
