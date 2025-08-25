# Check Booking Status - Universal Public Feature

## Overview
Fitur publik yang memungkinkan tamu untuk mengecek status booking **Hostel dan Auditorium** menggunakan ID booking, mirip dengan sistem check-in maskapai penerbangan. Satu platform untuk kedua jenis booking.

## Features
✅ **Universal Search** - Dapat mencari booking hostel dan auditorium dalam satu platform  
✅ **Public Access** - Tidak memerlukan login atau autentikasi  
✅ **PDF Download** - Download konfirmasi booking dalam format PDF  
✅ **Responsive Design** - Optimized untuk mobile dan desktop  
✅ **Real-time Data** - Data langsung dari database PayloadCMS  
✅ **Dual Support** - Hostel dan Auditorium booking dalam satu interface  

## URL Access

### Public Check Booking Page
```
/check-booking
/en/check-booking  
/id/check-booking
/ar/check-booking
```

### API Endpoints
```
GET /api/booking/[id]           # Get booking details
GET /api/booking/[id]/pdf       # Download PDF confirmation  
POST /api/booking/[id]/resend   # Resend WhatsApp (admin only)
```

## How to Use

### For Customers:
1. Visit `/check-booking` page
2. View information about hostel and auditorium booking support
3. Enter booking ID (dari email/WhatsApp konfirmasi)
4. Click "Cari Booking" 
5. System will automatically detect booking type (hostel/auditorium)
6. View comprehensive booking details and download PDF

### For Admin:
1. Visit `/admin/booking-query` for advanced features
2. Can resend WhatsApp confirmations
3. Full booking management

## Booking ID Format
- Format: MongoDB ObjectID (24 character hex string)
- Example: `507f1f77bcf86cd799439011`
- Location: Available in confirmation email/WhatsApp

## Display Information

### Hostel Booking Details:
- Personal info (name, country, passport)
- Contact info (WhatsApp, phone)
- Stay duration (check-in/out dates)
- Room selection (single/double/extra beds)
- Guest details (adults/children count)
- Payment status and price

### Auditorium Booking Details:
- Personal info (name, country)
- Contact info (WhatsApp, Egypt phone)
- Event details (name, date, time)
- Additional services selected
- Payment status and pricing

## Security & Privacy
- **No sensitive data exposed** - Only booking confirmation details
- **Public read-only access** - No modification capabilities
- **Rate limiting** - Prevents abuse of API endpoints
- **Error handling** - Generic error messages to prevent data leakage

## Mobile Experience
- **Touch-friendly** buttons and inputs
- **Responsive design** adapts to all screen sizes
- **Fast loading** optimized for mobile networks
- **Clear typography** easy to read on small screens

## Integration Points

### With PayloadCMS:
- Reads from `hostel-bookings` collection
- Reads from `auditorium-bookings` collection
- Uses existing PDF generation system
- Respects PayloadCMS access controls

### With WhatsApp API:
- Customers get booking ID via WhatsApp
- Admins can resend confirmations
- Maintains same message format

## Error Handling
- **Booking not found**: Clear message with suggestions
- **Invalid ID format**: Helpful error guidance
- **System errors**: Generic error message
- **Network issues**: Retry instructions

## Performance
- **Server-side rendering** for fast initial load
- **Cached API responses** for better performance  
- **Optimized images** and minimal bundle size
- **Progressive enhancement** works without JavaScript

## Browser Support
- ✅ Chrome/Safari/Firefox (modern versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Internet Explorer 11+ (with polyfills)

## Monitoring & Analytics
- Track booking lookup frequency
- Monitor error rates and types
- Measure user engagement and flow
- Performance metrics for optimization

---

This feature enhances customer experience by providing self-service booking status checking, reducing support workload while maintaining data security.
