# PDF Structure Implementation - Auditorium PDF di Folder PDF

## Overview
Implementasi ini memindahkan PDF auditorium ke struktur folder `pdf` yang konsisten dengan hostel, sehingga kedua jenis booking menggunakan pendekatan yang sama.

## Perubahan yang Dibuat

### 1. API Routes untuk PDF
Dibuat API routes baru di folder `/api/pdf/` untuk konsistensi:

#### `/api/pdf/auditorium/route.ts`
- **POST**: Generate dan download PDF auditorium
- **GET**: Endpoint untuk fetch PDF berdasarkan booking ID (placeholder)
- Input: `bookingData` dan `bookingId` (optional)
- Output: PDF file dengan proper headers

#### `/api/pdf/hostel/route.ts`
- **POST**: Generate dan download PDF hostel (untuk konsistensi)
- **GET**: Endpoint untuk fetch PDF berdasarkan booking ID (placeholder)
- Input: `bookingData` dan `bookingId` (optional)
- Output: PDF file dengan proper headers

### 2. Komponen React PDF untuk Auditorium
Dibuat komponen React PDF baru: `src/components/pdf/auditorium-booking-pdf.tsx`

#### Fitur Komponen:
- **Styling konsisten** dengan hostel PDF
- **Two-column layout** untuk informasi yang terorganisir
- **Sections**:
  - Header dengan branding Wisma Nusantara Cairo
  - Detail Acara (nama, tanggal, waktu, durasi)
  - Informasi Personal (nama, negara)
  - Kontak (phone, WhatsApp)
  - Layanan Tambahan (jika ada)
  - Fasilitas Auditorium & Status
  - Ringkasan Biaya dengan breakdown
- **Color coding**:
  - Primary (purple): Detail acara
  - Highlight (orange): Layanan tambahan
  - Success (green): Ringkasan biaya
- **Typography**: Plus Jakarta Sans Variable font

### 3. Update PDF Utils
Memperbarui `src/lib/pdf-utils.ts`:
- Menggunakan komponen React PDF yang baru
- Konsistensi error handling dengan hostel
- Improved error messages dalam bahasa Indonesia

### 4. Update PDF Server
Memperbarui `src/lib/pdf-server.ts`:
- Import komponen React PDF yang baru
- Konsistensi dengan hostel PDF generation

## Struktur File Baru

```
src/
├── app/
│   └── api/
│       └── pdf/
│           ├── auditorium/
│           │   └── route.ts          # API route untuk auditorium PDF
│           └── hostel/
│               └── route.ts          # API route untuk hostel PDF
├── components/
│   └── pdf/
│       ├── auditorium-booking-pdf.tsx  # Komponen React PDF auditorium
│       └── hostel-booking-pdf.tsx      # Komponen React PDF hostel (existing)
└── lib/
    ├── pdf-utils.ts                 # Updated utilities
    └── pdf-server.ts                # Updated server functions
```

## Cara Penggunaan

### Client-side (Download/Preview)
```typescript
import { downloadAuditoriumBookingPDF, previewAuditoriumBookingPDF } from '@/lib/pdf-utils'

// Download PDF
await downloadAuditoriumBookingPDF(bookingData, bookingId)

// Preview PDF
await previewAuditoriumBookingPDF(bookingData, bookingId)
```

### Server-side (API Route)
```typescript
// POST request ke /api/pdf/auditorium
const response = await fetch('/api/pdf/auditorium', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ bookingData, bookingId })
})

// Response akan berupa PDF file
const blob = await response.blob()
```

### WhatsApp Integration
PDF generation untuk WhatsApp tetap menggunakan fungsi yang ada di `pdf-server.ts`:
```typescript
import { generateAuditoriumBookingPDFBlobServer } from '@/lib/pdf-server'

const pdfBlob = await generateAuditoriumBookingPDFBlobServer(bookingData, bookingId)
```

## Konsistensi dengan Hostel

Sekarang kedua jenis booking (hostel dan auditorium) menggunakan:
1. **Struktur folder yang sama**: `/api/pdf/[type]/`
2. **Komponen React PDF**: Menggunakan `@react-pdf/renderer`
3. **Error handling yang konsisten**
4. **Styling dan layout yang serupa**
5. **Server-side generation untuk WhatsApp**

## Benefits

1. **Konsistensi**: Struktur yang sama untuk semua jenis PDF
2. **Maintainability**: Lebih mudah maintain dengan komponen React
3. **Flexibility**: Mudah untuk menambah jenis booking baru
4. **Performance**: Server-side generation yang efisien
5. **User Experience**: Error handling yang lebih baik

## Testing

Untuk testing implementasi ini:
1. Test download PDF dari confirmation page
2. Test preview PDF functionality
3. Test WhatsApp PDF generation
4. Test API routes langsung
5. Verify PDF content dan formatting

## Cleanup - File yang Dihapus

Sebagai bagian dari implementasi ini, file-file legacy yang tidak digunakan telah dihapus:

### ❌ File yang Dihapus:
1. **`src/lib/pdf-generator.ts`** - Legacy PDF generator yang menggunakan React.createElement
2. **`src/components/pdf/auditorium-pdf-component.tsx`** - Placeholder component yang tidak digunakan

### ✅ Alasan Penghapusan:
- **Tidak digunakan**: Tidak ada import atau reference ke file tersebut di codebase
- **Duplikasi**: Fungsi sudah digantikan oleh komponen React PDF yang baru
- **Konsistensi**: Menghilangkan pendekatan yang berbeda untuk PDF generation
- **Maintainability**: Mengurangi kompleksitas codebase

### 🔄 Migrasi:
- `generateAuditoriumBookingPDF()` dari `pdf-generator.ts` → `AuditoriumBookingPDF` component
- Server-side generation sekarang menggunakan `generateAuditoriumBookingPDFBuffer()` di `pdf-server.ts`
- Client-side generation menggunakan `generateAuditoriumBookingPDFBlob()` di `pdf-utils.ts`

## Future Enhancements

1. **Database integration**: Fetch booking data dari database untuk GET endpoints
2. **PDF caching**: Cache generated PDFs untuk performance
3. **Template customization**: Dynamic templates berdasarkan booking type
4. **Batch PDF generation**: Generate multiple PDFs sekaligus
5. **PDF analytics**: Track PDF downloads dan views
