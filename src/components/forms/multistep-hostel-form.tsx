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
import { useTranslations } from 'next-intl'
import type { Resolver } from 'react-hook-form'

// Steps will be created using translations in the component body

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
  const tSteps = useTranslations('hostel.steps')
  const tToasts = useTranslations('hostel.toasts')
  const totalSteps = 6

  // Initialize form with default values and any initial data
  const form = useForm<HostelBookingFormData>({
    resolver: zodResolver(hostelBookingSchema) as unknown as Resolver<HostelBookingFormData>,
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
      const validatedData = await hostelBookingSchema.parseAsync(formData)

      // Submit to API
      const result = await submitHostelBooking(validatedData)

      // Success
      toast.success(tToasts('successTitle'), {
        description: tToasts('successDesc'),
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
          {/** Build steps with translations here to keep titles reactive to locale */}
          {(() => {
            // Create translated steps
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
                id: 'room-selection',
                title: tSteps('roomSelection.title'),
                description: tSteps('roomSelection.description'),
                icon: <Bed className="h-4 w-4" />,
              },
              {
                id: 'stay-duration',
                title: tSteps('stayDuration.title'),
                description: tSteps('stayDuration.description'),
                icon: <Calendar className="h-4 w-4" />,
              },
              {
                id: 'contact-info',
                title: tSteps('contactInfo.title'),
                description: tSteps('contactInfo.description'),
                icon: <Phone className="h-4 w-4" />,
              },
              {
                id: 'additional-services',
                title: tSteps('additionalServices.title'),
                description: tSteps('additionalServices.description'),
                icon: <Settings className="h-4 w-4" />,
              },
              {
                id: 'summary',
                title: tSteps('summary.title'),
                description: tSteps('summary.description'),
                icon: <FileCheck className="h-4 w-4" />,
              },
            ] as const
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
                nextButtonText={undefined}
                previousButtonText={undefined}
                submitButtonText={undefined}
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
