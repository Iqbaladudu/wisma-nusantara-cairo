# Auditorium Booking Form Documentation

## Overview

The Auditorium Booking Form is a comprehensive multi-step form built with React Hook Form, Zod validation, and Shadcn UI components. It allows users to book auditorium facilities at Wisma Nusantara Cairo for events, seminars, conferences, and other activities.

## Features

### 🎯 Multi-Step Form Flow
1. **Personal Information** - Name and country of origin
2. **Event Details** - Event name, date, and time
3. **Contact Information** - Egypt phone number and WhatsApp
4. **Additional Information** - Coupon code and event notes (optional)
5. **Booking Summary** - Review all information before submission

### 🔧 Technical Features
- **Form Validation**: Zod schema validation with real-time feedback
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode Support**: Automatic theme switching
- **Accessibility**: WCAG 2.2 compliant with proper ARIA labels
- **Type Safety**: Full TypeScript support with generated types
- **Error Handling**: Comprehensive error states and user feedback

### 🎨 UI/UX Features
- **Modern Design**: Clean, professional interface with Shadcn UI
- **Progress Indicator**: Visual step progress with navigation
- **Interactive Elements**: Hover states, animations, and transitions
- **Validation Feedback**: Real-time form validation with helpful messages
- **Coupon Validation**: Live coupon code validation with discount display

## File Structure

```
src/
├── components/forms/
│   ├── multistep-auditorium-form.tsx          # Main form component
│   └── steps/
│       ├── auditorium-personal-info-step.tsx      # Step 1: Personal info
│       ├── auditorium-event-details-step.tsx      # Step 2: Event details
│       ├── auditorium-contact-info-step.tsx       # Step 3: Contact info
│       ├── auditorium-additional-info-step.tsx    # Step 4: Additional info
│       └── auditorium-booking-summary-step.tsx    # Step 5: Summary
├── lib/
│   ├── schemas.ts                             # Zod validation schemas
│   └── api.ts                                 # API functions
└── app/(frontend)/auditorium/
    └── page.tsx                               # Auditorium booking page
```

## Schema Structure

### AuditoriumBookingFormData Type
```typescript
type AuditoriumBookingFormData = {
  fullName: string
  countryOfOrigin: string
  eventDetails: {
    eventName: string
    eventDate: Date
    eventTime: string
  }
  contactInfo: {
    egyptPhoneNumber: string
    whatsappNumber: string
  }
  couponCode?: string
  eventNotes?: string
}
```

### Validation Rules
- **Full Name**: Minimum 2 characters
- **Country**: Minimum 2 characters
- **Event Name**: Minimum 2 characters
- **Event Date**: Cannot be in the past
- **Event Time**: 24-hour format (HH:MM)
- **Egypt Phone**: Egyptian phone number format (+20 or 0 + 10 digits)
- **WhatsApp**: International phone number format

## API Integration

### Endpoints
- `POST /api/auditorium-bookings` - Submit new booking
- `GET /api/coupons` - Validate coupon codes

### Data Flow
1. Form data is validated using Zod schemas
2. Data is formatted for PayloadCMS API
3. Submitted to backend with proper error handling
4. Success/error feedback shown to user

## Usage Examples

### Basic Implementation
```tsx
import { MultistepAuditoriumForm } from '@/components/forms/multistep-auditorium-form'

export default function BookingPage() {
  const handleSuccess = (data) => {
    console.log('Booking successful:', data)
    // Handle success (redirect, show message, etc.)
  }

  return (
    <MultistepAuditoriumForm
      onSuccess={handleSuccess}
      className="max-w-4xl mx-auto"
    />
  )
}
```

### With Initial Data
```tsx
<MultistepAuditoriumForm
  initialData={{
    fullName: "John Doe",
    countryOfOrigin: "Indonesia"
  }}
  onSuccess={handleSuccess}
/>
```

## Customization

### Styling
The form uses Tailwind CSS classes and can be customized by:
- Modifying the `className` prop
- Updating Tailwind configuration
- Customizing Shadcn UI component styles

### Validation
Add custom validation rules in `src/lib/schemas.ts`:
```typescript
export const customValidation = z.object({
  // Add your custom fields and validation
})
```

### Steps
To add or modify steps:
1. Update the `steps` array in `multistep-auditorium-form.tsx`
2. Create new step components in the `steps/` directory
3. Update the schema and validation logic

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Logical focus flow between form elements
- **Error Announcements**: Screen reader announcements for validation errors
- **High Contrast**: Support for high contrast mode and custom themes

## Performance Optimizations

- **Code Splitting**: Components are lazy-loaded where appropriate
- **Form Optimization**: React Hook Form for minimal re-renders
- **Bundle Size**: Tree-shaking enabled for unused components
- **Caching**: API responses cached where appropriate

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Responsive**: Optimized for all screen sizes (320px+)

## Deployment Notes

1. Ensure all environment variables are set
2. PayloadCMS collections must be properly configured
3. API endpoints should be accessible from the frontend
4. Consider implementing rate limiting for form submissions

## Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] Calendar integration for availability checking
- [ ] Email notifications with booking confirmations
- [ ] Multi-language support (Arabic, English, Indonesian)
- [ ] Advanced pricing calculator with real-time updates
- [ ] File upload for event requirements/documents
