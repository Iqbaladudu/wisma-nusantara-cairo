'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { User, Bed, Calendar, Phone, Settings, FileCheck } from 'lucide-react'

import { MultiStepForm } from '@/components/ui/multi-step-form'
import { Form } from '@/components/ui/form'
import {
  HostelBookingFormData,
  hostelBookingSchema,
  stepSchemas,
  defaultValues,
} from '@/lib/schemas'
import { submitHostelBooking } from '@/lib/api'

// Step components (will be created separately)
import { PersonalInfoStep } from './steps/personal-info-step'
import { RoomSelectionStep } from './steps/room-selection-step'
import { StayDurationStep } from './steps/stay-duration-step'
import { ContactInfoStep } from './steps/contact-info-step'
import { AdditionalServicesStep } from './steps/additional-services-step'
import { BookingSummaryStep } from './steps/booking-summary-step'

// Define steps
const steps = [
  {
    id: 'personal-info',
    title: 'Informasi Personal',
    description: 'Masukkan data pribadi Anda',
    icon: <User className="h-4 w-4" />,
  },
  {
    id: 'room-selection',
    title: 'Pilih Kamar',
    description: 'Tentukan jenis dan jumlah kamar',
    icon: <Bed className="h-4 w-4" />,
  },
  {
    id: 'stay-duration',
    title: 'Durasi Menginap',
    description: 'Pilih tanggal check-in dan check-out',
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    id: 'contact-info',
    title: 'Informasi Kontak',
    description: 'Masukkan nomor telepon dan WhatsApp',
    icon: <Phone className="h-4 w-4" />,
  },
  {
    id: 'additional-services',
    title: 'Layanan Tambahan',
    description: 'Pilih layanan tambahan (opsional)',
    icon: <Settings className="h-4 w-4" />,
  },
  {
    id: 'summary',
    title: 'Ringkasan Booking',
    description: 'Periksa kembali detail booking Anda',
    icon: <FileCheck className="h-4 w-4" />,
  },
]

interface MultistepHostelFormProps {
  onSuccess?: (data: HostelBookingFormData) => void
  initialData?: Partial<HostelBookingFormData>
  className?: string
  redirectToConfirmation?: boolean
}

export function MultistepHostelForm({
  onSuccess,
  initialData,
  className,
  redirectToConfirmation = false,
}: MultistepHostelFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Initialize form with default values and any initial data
  const form = useForm<HostelBookingFormData>({
    resolver: zodResolver(hostelBookingSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialData,
    },
    mode: 'onChange',
  })

  // Validate current step
  const validateCurrentStep = async (): Promise<boolean> => {
    const currentStepSchema = stepSchemas[currentStep as keyof typeof stepSchemas]
    if (!currentStepSchema) return true

    const formData = form.getValues()

    try {
      // For step 6 (final validation), validate the entire form
      if (currentStep === 6) {
        await currentStepSchema.parseAsync(formData)
      } else {
        // For step 5 (additional services), extract only the relevant fields
        if (currentStep === 5) {
          const additionalServicesData = {
            couponCode: formData.couponCode,
            airportPickup: formData.airportPickup,
            departureDateTime: formData.departureDateTime,
            mealOptions: formData.mealOptions,
          }
          await currentStepSchema.parseAsync(additionalServicesData)
        } else {
          // For other steps, validate the entire form data (they should handle extra fields gracefully)
          await currentStepSchema.parseAsync(formData)
        }
      }
      return true
    } catch (error) {
      console.log('Validation error for step', currentStep, ':', error)
      // The form will show the validation errors automatically
      return false
    }
  }

  // Handle next step
  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Final validation
      const formData = form.getValues()
      const validatedData = await hostelBookingSchema.parseAsync(formData)

      // Submit to API
      const result = await submitHostelBooking(validatedData)

      // Success
      toast.success('Booking berhasil dikirim!', {
        description: 'Anda akan menerima konfirmasi melalui email dan WhatsApp.',
      })

      // Handle redirect or callback
      if (redirectToConfirmation) {
        // Encode booking data for URL
        const encodedData = btoa(JSON.stringify(validatedData))
        const bookingId = result.id || Date.now().toString()
        router.push(`/hostel/confirmation?data=${encodedData}&id=${bookingId}`)
      } else {
        onSuccess?.(validatedData)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Gagal mengirim booking', {
          description: error.message,
        })
      } else {
        toast.error('Terjadi kesalahan', {
          description: 'Silakan coba lagi atau hubungi customer service.',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep form={form} />
      case 2:
        return <RoomSelectionStep form={form} />
      case 3:
        return <StayDurationStep form={form} />
      case 4:
        return <ContactInfoStep form={form} />
      case 5:
        return <AdditionalServicesStep form={form} />
      case 6:
        return <BookingSummaryStep form={form} onEdit={setCurrentStep} />
      default:
        return null
    }
  }

  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})}>
          <MultiStepForm
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            variant="card"
            nextButtonText="Lanjut"
            previousButtonText="Kembali"
            submitButtonText="Kirim Booking"
            showProgress={true}
            className="max-w-4xl mx-auto"
          >
            {renderStepContent()}
          </MultiStepForm>
        </form>
      </Form>
    </div>
  )
}
