# Wisma Nusantara Cairo - Dynamic Pricing & Coupon System

## Overview

Sistem pricing dinamis dan coupon yang terintegrasi dengan PayloadCMS untuk mengelola harga hostel dan hall secara otomatis berdasarkan berbagai faktor seperti musim, hari weekend, dan kupon diskon.

## Features

### 1. Dynamic Pricing System
- **Automatic Price Calculation**: Harga dihitung otomatis berdasarkan konfigurasi pricing
- **Seasonal Multipliers**: Penyesuaian harga berdasarkan musim (Ramadan, Summer, Winter, dll)
- **Weekend Pricing**: Multiplier khusus untuk weekend (Jumat & Sabtu)
- **Guest-based Pricing**: Harga per orang untuk hostel dengan diskon anak-anak
- **Event-based Pricing**: Harga per event untuk hall

### 2. Coupon System
- **Multiple Discount Types**: Percentage, Fixed Amount, Free Nights, Free Hours
- **Usage Limits**: Global dan per-user limits
- **Date Restrictions**: Valid from/until dates
- **Service Restrictions**: Applicable untuk hostel, hall, atau keduanya
- **Country Restrictions**: Pembatasan berdasarkan negara asal
- **Weekend Exclusions**: Opsi untuk menonaktifkan di weekend
- **First-time User Only**: Kupon khusus untuk pengguna baru

### 3. Automatic Integration
- **PayloadCMS Hooks**: Pricing dihitung otomatis saat booking dibuat/diupdate
- **Coupon Usage Tracking**: Otomatis update usage count dan history
- **Error Handling**: Fallback pricing jika calculation gagal

## Collections

### 1. PricingConfig Collection (`/admin/collections/pricing-config`)

**Fields:**
- `name`: Nama konfigurasi pricing
- `type`: Jenis pricing (hostel_per_person, hall_per_event, dll)
- `basePrice`: Harga dasar dalam EGP
- `seasonalMultipliers`: Array multiplier berdasarkan musim
- `weekendMultiplier`: Multiplier untuk weekend
- `minimumStay`: Minimum malam untuk hostel
- `maximumCapacity`: Kapasitas maksimum
- `additionalGuestFee`: Biaya tambahan per tamu
- `childDiscount`: Diskon persentase untuk anak-anak
- `isActive`: Status aktif
- `validFrom/validUntil`: Periode berlaku

### 2. Coupons Collection (`/admin/collections/coupons`)

**Fields:**
- `code`: Kode kupon (unique, uppercase)
- `name`: Nama kupon
- `type`: Jenis diskon (percentage, fixed, free_nights, free_hours)
- `discountValue`: Nilai diskon
- `maxDiscountAmount`: Maksimum diskon untuk percentage
- `minimumOrderAmount`: Minimum order untuk menggunakan kupon
- `applicableServices`: Service yang berlaku (hostel/hall)
- `usageLimit`: Limit penggunaan global
- `usageCount`: Jumlah penggunaan saat ini
- `perUserLimit`: Limit per user
- `validFrom/validUntil`: Periode berlaku
- `isActive`: Status aktif
- `isFirstTimeOnly`: Khusus pengguna baru
- `excludeWeekends`: Exclude weekend
- `allowedCountries`: Negara yang diizinkan
- `usageHistory`: History penggunaan

## Updated Booking Collections

### HostelBookings & HallBookings

**New Fields:**
- `couponCode`: Kode kupon (optional)
- `pricing`: Group field berisi:
  - `basePrice`: Harga dasar
  - `seasonalMultiplier`: Multiplier musiman
  - `weekendMultiplier`: Multiplier weekend
  - `couponDiscount`: Diskon dari kupon
  - `finalPrice`: Harga final
  - `priceBreakdown`: Detail breakdown dalam JSON

## API Usage

### Frontend Forms
Forms sekarang tidak lagi memerlukan input manual untuk pricing. User hanya perlu:
1. Mengisi detail booking (tanggal, tamu, dll)
2. Opsional: Memasukkan kode kupon
3. Memilih payment status

Pricing akan dihitung otomatis oleh PayloadCMS hooks.

### Pricing Calculation Flow
1. User submit form dengan data booking
2. PayloadCMS hook `beforeChange` dipanggil
3. System mencari pricing config yang aktif
4. Menghitung base price berdasarkan tipe dan durasi
5. Menerapkan seasonal multiplier jika ada
6. Menerapkan weekend multiplier jika applicable
7. Validasi dan aplikasi kupon jika ada
8. Update coupon usage count dan history
9. Simpan hasil calculation ke database

## Sample Data

### Pricing Configurations
- **Hostel Standard Rate**: EGP 150/person/night
  - Ramadan season: +30%
  - Summer high season: +20%
  - Winter low season: -20%
  - Weekend: +15%
  - Child discount: 25%

- **Hall Event Standard Rate**: EGP 2,500/event
  - Wedding season: +50%
  - Conference season: +20%
  - Weekend: +25%

### Sample Coupons
- **WELCOME10**: 10% discount untuk new customers
- **RAMADAN2024**: EGP 100 fixed discount untuk Ramadan
- **STUDENT20**: 20% discount untuk students (exclude weekends)
- **FREENIGHT**: 1 free night untuk stay 3+ nights
- **EARLYBIRD**: 15% discount untuk hall booking 30 hari sebelumnya

## Setup Instructions

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Generate Types
```bash
pnpm generate:types
```

### 3. Seed Sample Data
```bash
pnpm seed
```

### 4. Run Development Server
```bash
pnpm dev
```

### 5. Access Admin Panel
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin

## Configuration

### Environment Variables
Pastikan `.env` file berisi:
```
DATABASE_URI=your_postgres_connection_string
PAYLOAD_SECRET=your_secret_key
```

### Pricing Configuration
1. Login ke admin panel
2. Navigate ke Collections > Pricing Config
3. Create atau edit pricing configurations
4. Set seasonal multipliers, weekend rates, dll

### Coupon Management
1. Navigate ke Collections > Coupons
2. Create coupon dengan kode unik
3. Set discount type, value, dan restrictions
4. Monitor usage melalui usage history

## Technical Details

### Pricing Calculation Logic
- **Hostel**: Base price × guests × nights × seasonal × weekend - child discount - coupon
- **Hall**: Base price × seasonal × weekend - coupon
- **Weekend Detection**: Friday (5) dan Saturday (6)
- **Seasonal Matching**: Berdasarkan tanggal dengan support cross-year seasons

### Error Handling
- Jika pricing calculation gagal, system akan set default values
- Errors di-log untuk debugging
- Coupon validation errors ditampilkan ke user

### Performance Considerations
- Pricing calculation dilakukan server-side saat save
- Results di-cache dalam database
- Minimal API calls untuk real-time pricing

## Future Enhancements

1. **Real-time Pricing Preview**: Show calculated price in form before submit
2. **Advanced Seasonal Rules**: More complex date-based pricing
3. **Group Discounts**: Automatic discounts untuk group bookings
4. **Dynamic Availability**: Integrate dengan availability system
5. **Analytics Dashboard**: Pricing performance dan coupon usage analytics
6. **API Endpoints**: Dedicated endpoints untuk pricing calculation
7. **Multi-currency Support**: Support untuk multiple currencies
