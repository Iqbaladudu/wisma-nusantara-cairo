# Checkbox Room Selection Implementation

## Overview
Form pemilihan kamar telah diubah dari dropdown/select menjadi **checkbox dengan hardcoded room types**. Perubahan ini menghilangkan ketergantungan pada collection RoomTypes terpisah dan membuat form lebih sederhana.

## Key Changes

### 1. **Schema Update**
- **Before**: Array of room selections dengan dynamic room types
- **After**: Object dengan fixed room types sebagai checkbox

```typescript
// OLD Schema
roomSelection: z.array(
  z.object({
    roomType: z.string().min(1, 'Room type is required'),
    numberOfRooms: z.number().min(1).max(10),
    extraBeds: z.number().min(0).max(10),
  })
).min(1, 'At least one room type must be selected')

// NEW Schema  
roomSelection: z.object({
  singleBed: z.object({
    selected: z.boolean(),
    numberOfRooms: z.number().min(0).max(10).default(0),
    extraBeds: z.number().min(0).max(5).default(0),
  }),
  doubleBed: z.object({ /* same structure */ }),
  twinBed: z.object({ /* same structure */ }),
  familyRoom: z.object({ /* same structure */ }),
})
```

### 2. **Hardcoded Room Types**
Room types sekarang di-hardcode dalam komponen:

```typescript
const ROOM_TYPES = [
  {
    key: 'singleBed',
    name: 'Single Bed',
    description: 'Kamar dengan 1 tempat tidur single',
    basePrice: 150,
    maxOccupancy: 1,
    allowExtraBed: true,
    extraBedPrice: 50,
  },
  {
    key: 'doubleBed',
    name: 'Double Bed', 
    description: 'Kamar dengan 1 tempat tidur double',
    basePrice: 200,
    maxOccupancy: 2,
    allowExtraBed: true,
    extraBedPrice: 50,
  },
  {
    key: 'twinBed',
    name: 'Twin Bed',
    description: 'Kamar dengan 2 tempat tidur single', 
    basePrice: 250,
    maxOccupancy: 2,
    allowExtraBed: true,
    extraBedPrice: 50,
  },
  {
    key: 'familyRoom',
    name: 'Family Room',
    description: 'Kamar keluarga dengan beberapa tempat tidur',
    basePrice: 350,
    maxOccupancy: 4,
    allowExtraBed: false,
    extraBedPrice: 0,
  },
]
```

### 3. **New Component: CheckboxRoomSelection**
- File: `src/components/forms/checkbox-room-selection.tsx`
- Menggunakan checkbox untuk setiap room type
- Input fields hanya muncul ketika checkbox dicentang
- Visual feedback dengan ring border ketika selected

### 4. **API Formatting**
Function `formatHostelBookingForApi` diupdate untuk mengkonversi format checkbox ke format array yang diharapkan backend:

```typescript
// Converts from checkbox format to backend array format
const roomSelectionArray = []
if (data.roomSelection.singleBed.selected) {
  roomSelectionArray.push({
    roomType: 'single-bed',
    numberOfRooms: data.roomSelection.singleBed.numberOfRooms,
    extraBeds: data.roomSelection.singleBed.extraBeds,
  })
}
// ... similar for other room types
```

## User Experience

### **Checkbox Interface**
- ✅ **Clear Selection**: Checkbox untuk setiap jenis kamar
- ✅ **Conditional Fields**: Input jumlah kamar dan extra beds hanya muncul ketika checkbox dicentang
- ✅ **Visual Feedback**: Card dengan ring border ketika selected
- ✅ **Price Display**: Harga per malam ditampilkan di badge
- ✅ **Description**: Deskripsi singkat untuk setiap jenis kamar

### **Form Behavior**
- **Validation**: Minimal satu jenis kamar harus dipilih
- **Dynamic Fields**: Input fields muncul/hilang berdasarkan checkbox
- **Auto-disable**: Extra beds disabled untuk Family Room
- **Summary**: Ringkasan untuk setiap pilihan kamar yang selected

## Benefits

### **For Users**
- ✅ **Lebih Intuitif**: Checkbox lebih mudah dipahami daripada dropdown
- ✅ **Visual Clear**: Bisa melihat semua opsi sekaligus
- ✅ **Multiple Selection**: Bisa pilih beberapa jenis kamar dengan mudah
- ✅ **Price Transparency**: Harga langsung terlihat

### **For Developers**
- ✅ **No External Dependencies**: Tidak perlu fetch room types dari API
- ✅ **Simpler Logic**: Tidak ada complex array management
- ✅ **Predictable Data**: Fixed structure, easier to handle
- ✅ **Better Performance**: No loading states untuk room types

### **For System**
- ✅ **Reduced API Calls**: Tidak perlu endpoint untuk room types
- ✅ **Simpler Backend**: Tidak perlu maintain room types collection
- ✅ **Consistent Pricing**: Hardcoded prices, no sync issues
- ✅ **Easier Maintenance**: Changes hanya di frontend code

## Migration Notes

### **Schema Changes**
- Form data structure berubah dari array ke object
- Backend tetap menerima format array (dikonversi di API layer)
- Validation rules disesuaikan untuk checkbox format

### **Component Updates**
- `CheckboxRoomSelection` menggantikan `SimpleRoomSelection`
- Default values diupdate untuk object structure
- Form submission logic tetap sama

### **Backward Compatibility**
- API formatting function mengkonversi ke format lama
- Backend tidak perlu perubahan
- Existing data tetap compatible

## Room Types Configuration

Jika perlu mengubah room types, edit array `ROOM_TYPES` di file `checkbox-room-selection.tsx`:

```typescript
// Add new room type
{
  key: 'newRoomType',
  name: 'New Room Type',
  description: 'Description here',
  basePrice: 300,
  maxOccupancy: 3,
  allowExtraBed: true,
  extraBedPrice: 60,
}
```

Jangan lupa update schema di `schemas.ts` jika menambah room type baru.

## Future Considerations

- Room types bisa dipindah ke config file terpisah
- Pricing bisa dibuat dynamic dengan environment variables
- Bisa ditambah room images atau amenities
- Validation rules bisa dibuat lebih sophisticated
