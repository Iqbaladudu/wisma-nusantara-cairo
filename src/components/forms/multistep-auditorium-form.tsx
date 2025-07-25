'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { User, Calendar, Phone, FileText, FileCheck } from 'lucide-react'

import { MultiStepForm } from '@/components/ui/multi-step-form'
import { Form } from '@/components/ui/form'
import {
  AuditoriumBookingFormData,
  auditoriumBookingSchema,
  auditoriumStepSchemas,
  auditoriumDefaultValues,
} from '@/lib/schemas'
import { submitAuditoriumBooking } from '@/lib/api'

// Step components (will be created separately)
import { AuditoriumPersonalInfoStep } from './steps/auditorium-personal-info-step'
import { AuditoriumEventDetailsStep } from './steps/auditorium-event-details-step'
import { AuditoriumContactInfoStep } from './steps/auditorium-contact-info-step'
import { AuditoriumAdditionalInfoStep } from './steps/auditorium-additional-info-step'
import { AuditoriumBookingSummaryStep } from './steps/auditorium-booking-summary-step'

// Define steps
const steps = [
  {
    id: 'personal-info',
    title: 'Informasi Personal',
    description: 'Masukkan data pribadi Anda',
    icon: <User className="h-4 w-4" />,
  },
  {
    id: 'event-details',
    title: 'Detail Acara',
    description: 'Informasi tentang acara Anda',
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    id: 'contact-info',
    title: 'Informasi Kontak',
    description: 'Masukkan nomor telepon dan WhatsApp',
    icon: <Phone className="h-4 w-4" />,
  },
  {
    id: 'additional-info',
    title: 'Informasi Tambahan',
    description: 'Coupon code dan catatan (opsional)',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: 'summary',
    title: 'Ringkasan Booking',
    description: 'Periksa kembali detail booking Anda',
    icon: <FileCheck className="h-4 w-4" />,
  },
]

interface MultistepAuditoriumFormProps {
  onSuccess?: (data: AuditoriumBookingFormData) => void
  initialData?: Partial<AuditoriumBookingFormData>
  className?: string
  redirectToConfirmation?: boolean
}

export function MultistepAuditoriumForm({
  onSuccess,
  initialData,
  className,
  redirectToConfirmation = false,
}: MultistepAuditoriumFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Initialize form with default values and any initial data
  const form = useForm<AuditoriumBookingFormData>({
    resolver: zodResolver(auditoriumBookingSchema),
    defaultValues: {
      ...auditoriumDefaultValues,
      ...initialData,
    },
    mode: 'onChange',
  })

  // Validate current step
  const validateCurrentStep = async (): Promise<boolean> => {
    const currentStepSchema =
      auditoriumStepSchemas[currentStep as keyof typeof auditoriumStepSchemas]
    if (!currentStepSchema) return true

    const formData = form.getValues()

    try {
      await currentStepSchema.parseAsync(formData)
      return true
    } catch (error) {
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
      const validatedData = await auditoriumBookingSchema.parseAsync(formData)

      // Submit to API
      const result = await submitAuditoriumBooking(validatedData)

      // Success
      toast.success('Booking auditorium berhasil dikirim!', {
        description: 'Anda akan menerima konfirmasi melalui email dan WhatsApp.',
      })

      // Handle redirect or callback
      if (redirectToConfirmation) {
        // Encode booking data for URL
        const encodedData = btoa(JSON.stringify(validatedData))
        const bookingId = result.id || Date.now().toString()
        router.push(`/auditorium/confirmation?data=${encodedData}&id=${bookingId}`)
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
        return <AuditoriumPersonalInfoStep form={form} />
      case 2:
        return <AuditoriumEventDetailsStep form={form} />
      case 3:
        return <AuditoriumContactInfoStep form={form} />
      case 4:
        return <AuditoriumAdditionalInfoStep form={form} />
      case 5:
        return <AuditoriumBookingSummaryStep form={form} onEdit={setCurrentStep} />
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
