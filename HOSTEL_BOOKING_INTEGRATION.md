# Hostel Booking Form Integration

## Overview
Integrasi lengkap untuk form booking hostel dengan additional services (Airport Pickup dan Meal Options) serta Booking Summary yang terintegrasi dengan backend PayloadCMS.

## Komponen yang Diintegrasikan

### 1. Airport Pickup Selection (`airport-pickup-selection.tsx`)
- **Fitur**: Pilihan layanan penjemputan bandara
- **Options**:
  - No pickup (gratis)
  - Medium Private Vehicle ($35 USD, 2-4 penumpang)
  - Hiace Van ($50 USD, hingga 10 penumpang)
- **Input tambahan**: Tanggal dan waktu keberangkatan
- **Validasi**: Tanggal tidak boleh di masa lalu, format waktu HH:MM

### 2. Meal Options Selection (`meal-options-selection.tsx`)
- **Fitur**: Paket makanan Indonesia untuk breakfast, lunch, dan dinner
- **Paket tersedia**:
  - Nasi Goreng (100 EGP, min 4 porsi)
  - Ayam Goreng (120 EGP, min 4 porsi)
  - Nasi Kuning (130 EGP, min 10 porsi)
- **Konfigurasi**: Jumlah porsi dan frekuensi (check-in only, during stay, check-out only)
- **Kalkulasi otomatis**: Total biaya per paket

### 3. Booking Summary (`booking-summary.tsx`)
- **Fitur**: Ringkasan lengkap booking dengan breakdown biaya
- **Menampilkan**:
  - Informasi personal dan kontak
  - Detail kamar dan tamu
  - Durasi menginap
  - Airport pickup yang dipilih dengan jadwal
  - Meal packages yang dipilih dengan detail
  - Total biaya additional services
- **Type Safety**: Helper functions untuk akses data yang aman

### 4. Enhanced Hostel Booking Form (`hostel-booking-form.tsx`)
- **Integrasi**: Semua komponen terintegrasi dalam satu form
- **Fitur baru**:
  - Toggle button untuk show/hide summary
  - Default values untuk airport pickup dan meal options
  - Validasi terintegrasi dengan schema yang sudah ada

## Schema Integration

Schema di `src/lib/schemas.ts` sudah mendukung:

```typescript
// Airport Pickup
airportPickup: z.enum(['none', 'medium_vehicle', 'hiace']).default('none')
departureDateTime: z.object({
  departureDate: z.date().optional(),
  departureTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
}).optional()

// Meal Options
mealOptions: z.object({
  // Breakfast, Lunch, Dinner options
  breakfastOption: z.enum(['none', 'nasi_goreng', 'ayam_goreng', 'nasi_kuning']).default('none'),
  breakfastPortions: z.number().min(0).optional(),
  breakfastFrequency: z.enum(['checkin_only', 'during_stay', 'checkout_only']).optional(),
  // ... similar untuk lunch dan dinner
}).optional()
```

## Demo Page

Demo page tersedia di `src/app/demo/hostel-booking/page.tsx` yang menampilkan:
- Form booking lengkap dengan semua fitur
- Sidebar dengan informasi pricing
- Highlight fitur-fitur utama
- Display hasil submission

## Fitur Utama

### 1. **User Experience**
- **Progressive disclosure**: Additional services ditampilkan setelah informasi dasar
- **Visual feedback**: Icons, colors, dan animations untuk setiap section
- **Responsive design**: Mobile-first approach
- **Accessibility**: Proper labels, ARIA attributes, keyboard navigation

### 2. **Type Safety**
- **Zod validation**: Schema validation untuk semua input
- **TypeScript**: Full type safety dengan helper functions
- **Error handling**: Proper error messages dan validation feedback

### 3. **Cost Calculation**
- **Real-time calculation**: Biaya dihitung otomatis saat user memilih
- **Multi-currency**: USD untuk airport pickup, EGP untuk meals
- **Breakdown detail**: Tampilan detail biaya per service

### 4. **Integration Ready**
- **PayloadCMS compatible**: Schema dan API sudah siap untuk backend
- **Form state management**: React Hook Form dengan proper validation
- **API integration**: Siap untuk integrasi dengan existing API endpoints

## Cara Penggunaan

1. **Import komponen**:
```typescript
import { HostelBookingForm } from '@/components/forms/hostel-booking-form'
```

2. **Gunakan dalam page**:
```typescript
<HostelBookingForm 
  onSuccess={(data) => console.log('Booking submitted:', data)}
  initialData={existingData} // optional
  isEditing={false} // optional
/>
```

3. **Akses demo**: Kunjungi `/demo/hostel-booking` untuk melihat implementasi lengkap

## Additional Services Pricing

### Airport Pickup
- **Medium Private Vehicle**: $35 USD (2-4 passengers)
- **Hiace Van**: $50 USD (up to 10 passengers)

### Indonesian Meal Packages
- **Nasi Goreng**: 100 EGP per person (minimum 4 portions)
- **Ayam Goreng**: 120 EGP per person (minimum 4 portions)  
- **Nasi Kuning**: 130 EGP per person (minimum 10 portions)

## Technical Implementation

### Form State Management
- **React Hook Form**: Untuk form state dan validation
- **Zod Resolver**: Untuk schema validation
- **Watch values**: Real-time updates untuk calculations

### Component Architecture
- **Modular design**: Setiap service sebagai komponen terpisah
- **Reusable components**: FormFieldWrapper untuk konsistensi
- **Type safety**: Generic types untuk form fields

### Styling
- **Shadcn UI**: Consistent design system
- **Tailwind CSS**: Utility-first styling
- **Responsive design**: Mobile-first approach
- **Dark mode ready**: Theme-aware components

## Next Steps

1. **Backend Integration**: Implement PayloadCMS collections untuk additional services
2. **Payment Integration**: Tambahkan payment gateway untuk additional services
3. **Email Notifications**: Setup email templates untuk booking confirmation
4. **Admin Dashboard**: Interface untuk manage bookings dan services
5. **Reporting**: Analytics dan reporting untuk booking trends

## Files Modified/Created

- `src/components/forms/hostel-booking-form.tsx` - Enhanced dengan additional services
- `src/components/forms/booking-summary.tsx` - New component untuk summary
- `src/components/forms/form-field-wrapper.tsx` - Added className prop
- `src/app/demo/hostel-booking/page.tsx` - Demo page
- `HOSTEL_BOOKING_INTEGRATION.md` - Documentation

Integrasi ini memberikan pengalaman booking yang lengkap dan professional dengan semua additional services terintegrasi dalam satu form yang user-friendly.
