'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { User, Calendar, Phone, Settings, FileText, FileCheck } from 'lucide-react'

import { MultiStepForm } from '@/components/ui/multi-step-form'
import { Form } from '@/components/ui/form'
import {
  AuditoriumBookingFormData,
  auditoriumBookingSchema,
  auditoriumStepSchemas,
  auditoriumDefaultValues,
} from '@/lib/schemas'
import { submitAuditoriumBooking } from '@/lib/api'
import { useTranslations } from 'next-intl'
import type { Resolver } from 'react-hook-form'

// Step components (will be created separately)
import { AuditoriumPersonalInfoStep } from './steps/auditorium-personal-info-step'
import { AuditoriumEventDetailsStep } from './steps/auditorium-event-details-step'
import { AuditoriumContactInfoStep } from './steps/auditorium-contact-info-step'
import { AuditoriumExcludeServicesStep } from './steps/auditorium-exclude-services-step'
import { AuditoriumAdditionalInfoStep } from './steps/auditorium-additional-info-step'
import { AuditoriumBookingSummaryStep } from './steps/auditorium-booking-summary-step'

// Steps will be created with translations inside the component

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
  const tSteps = useTranslations('auditorium.steps')
  const tToasts = useTranslations('auditorium.toasts')
  const totalSteps = 6

  // Initialize form with default values and any initial data
  const form = useForm<AuditoriumBookingFormData>({
    resolver: zodResolver(
      auditoriumBookingSchema,
    ) as unknown as Resolver<AuditoriumBookingFormData>,
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
    } catch (_error) {
      // The form will show the validation errors automatically
      return false
    }
  }

  // Handle next step
  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    console.log(isValid)
    if (isValid && currentStep < totalSteps) {
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
      toast.success(tToasts('successTitle'), {
        description: tToasts('successDesc'),
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
        toast.error(tToasts('errorTitle'), {
          description: error.message,
        })
      } else {
        toast.error(tToasts('errorGeneric'), {
          description: tToasts('errorGenericDesc'),
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
        return <AuditoriumExcludeServicesStep form={form} />
      case 5:
        return <AuditoriumAdditionalInfoStep form={form} />
      case 6:
        return <AuditoriumBookingSummaryStep form={form} onEdit={setCurrentStep} />
      default:
        return null
    }
  }

  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})}>
          {(() => {
            const steps: {
              id: string
              title: string
              description?: string
              icon: React.ReactNode
            }[] = [
              {
                id: 'personal-info',
                title: tSteps('personalInfo.title'),
                description: tSteps('personalInfo.description'),
                icon: <User className="h-4 w-4" />,
              },
              {
                id: 'event-details',
                title: tSteps('eventDetails.title'),
                description: tSteps('eventDetails.description'),
                icon: <Calendar className="h-4 w-4" />,
              },
              {
                id: 'contact-info',
                title: tSteps('contactInfo.title'),
                description: tSteps('contactInfo.description'),
                icon: <Phone className="h-4 w-4" />,
              },
              {
                id: 'exclude-services',
                title: tSteps('excludeServices.title'),
                description: tSteps('excludeServices.description'),
                icon: <Settings className="h-4 w-4" />,
              },
              {
                id: 'additional-info',
                title: tSteps('additionalInfo.title'),
                description: tSteps('additionalInfo.description'),
                icon: <FileText className="h-4 w-4" />,
              },
              {
                id: 'summary',
                title: tSteps('summary.title'),
                description: tSteps('summary.description'),
                icon: <FileCheck className="h-4 w-4" />,
              },
            ]
            return (
              <MultiStepForm
                steps={steps}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
                variant="card"
                showProgress={true}
                className="max-w-4xl mx-auto"
              >
                {renderStepContent()}
              </MultiStepForm>
            )
          })()}
        </form>
      </Form>
    </div>
  )
}
