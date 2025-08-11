'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AnimatedButton } from '@/components/ui/animated-button'
import { StepDots, type Step } from '@/components/ui/step-indicator'
import { Progress } from '@/components/ui/progress'
import { useTranslations } from 'next-intl'

export interface MultiStepFormProps {
  steps: Step[]
  currentStep: number
  onStepChange: (step: number) => void
  onNext?: () => void | Promise<void>
  onPrevious?: () => void
  onSubmit?: () => void | Promise<void>
  children: React.ReactNode
  className?: string
  showProgress?: boolean
  showStepIndicator?: boolean
  allowStepNavigation?: boolean
  isLoading?: boolean
  nextButtonText?: string
  previousButtonText?: string
  submitButtonText?: string
  variant?: 'default' | 'minimal' | 'card'
}

export function MultiStepForm({
  steps,
  currentStep,
  onStepChange,
  onNext,
  onPrevious,
  onSubmit,
  children,
  className,
  showProgress = true,
  showStepIndicator = false,
  allowStepNavigation: _allowStepNavigation = false,
  isLoading = false,
  nextButtonText,
  previousButtonText,
  submitButtonText,
  variant = 'default',
}: MultiStepFormProps) {
  const t = useTranslations('common')
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === steps.length
  const progress = (currentStep / steps.length) * 100

  const handleNext = async () => {
    if (onNext) {
      await onNext()
    } else if (currentStep < steps.length) {
      onStepChange(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious()
    } else if (currentStep > 1) {
      onStepChange(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit()
    }
  }

  // Step click handler omitted in this variant

  const content = (
    <div className="space-y-6">
      {/* Progress Bar */}
      {showProgress && (
        <div className="animate-fade-in mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{t('step', { current: currentStep, total: steps.length })}</span>
            <span>{t('complete', { percent: Math.round(progress) })}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-center mt-2">
            <p className="text-sm font-medium text-foreground">{steps[currentStep - 1]?.title}</p>
            {steps[currentStep - 1]?.description && (
              <p className="text-xs text-muted-foreground">{steps[currentStep - 1].description}</p>
            )}
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="animate-slide-up">{children}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4 sm:pt-6 border-t">
        <div>
          {!isFirstStep && (
            <AnimatedButton
              type="button"
              variant="outline"
              size="default"
              onClick={handlePrevious}
              disabled={isLoading}
              icon={<ChevronLeft className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">{previousButtonText ?? t('back')}</span>
              <span className="sm:hidden">{t('back')}</span>
            </AnimatedButton>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Step dots for mobile */}
          <div className="sm:hidden">
            <StepDots totalSteps={steps.length} currentStep={currentStep} />
          </div>
        </div>

        <div>
          {isLastStep ? (
            <AnimatedButton
              type="button"
              variant="default"
              size="default"
              onClick={handleSubmit}
              loading={isLoading}
              loadingText={t('submitting')}
              disabled={isLoading}
              rightIcon={!isLoading && <ChevronRight className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">{submitButtonText ?? t('submit')}</span>
              <span className="sm:hidden">{t('submit')}</span>
            </AnimatedButton>
          ) : (
            <AnimatedButton
              type="button"
              variant="default"
              size="default"
              onClick={handleNext}
              disabled={isLoading}
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">{nextButtonText ?? t('next')}</span>
              <span className="sm:hidden">{t('next')}</span>
            </AnimatedButton>
          )}
        </div>
      </div>
    </div>
  )

  if (variant === 'card') {
    return (
      <Card className={cn('w-full max-w-3xl mx-auto card-flat', className)}>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              {steps[currentStep - 1]?.title}
            </h2>
            {steps[currentStep - 1]?.description && (
              <p className="text-muted-foreground mt-1 sm:mt-2 text-sm">
                {steps[currentStep - 1].description}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">{content}</CardContent>
      </Card>
    )
  }

  return <div className={cn('w-full max-w-4xl mx-auto', className)}>{content}</div>
}
