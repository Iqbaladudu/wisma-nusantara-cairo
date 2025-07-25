'use client'

import * as React from 'react'
import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Step {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  className?: string
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'minimal'
}

export function StepIndicator({
  steps,
  currentStep,
  className,
  orientation = 'horizontal',
  variant = 'default',
}: StepIndicatorProps) {
  const isHorizontal = orientation === 'horizontal'
  const isMinimal = variant === 'minimal'

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'items-center justify-between' : 'flex-col space-y-4',
        className,
      )}
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep
        const isUpcoming = stepNumber > currentStep

        return (
          <React.Fragment key={step.id}>
            <div className={cn('flex items-center', !isHorizontal && 'w-full')}>
              {/* Step Circle */}
              <div
                className={cn(
                  'relative flex items-center justify-center rounded-full border-2 transition-all duration-200',
                  isMinimal ? 'h-6 w-6 sm:h-8 sm:w-8' : 'h-8 w-8 sm:h-10 sm:w-10',
                  isCompleted && 'border-primary bg-primary text-primary-foreground',
                  isCurrent && 'border-primary bg-background text-primary',
                  isUpcoming && 'border-muted-foreground/30 bg-background text-muted-foreground',
                )}
              >
                {isCompleted ? (
                  <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : step.icon ? (
                  <div className="h-3 w-3 sm:h-4 sm:w-4">{step.icon}</div>
                ) : (
                  <span className="text-xs sm:text-sm font-medium">{stepNumber}</span>
                )}
              </div>

              {/* Step Content */}
              {!isMinimal && (
                <div className={cn('ml-3 flex-1', isHorizontal && 'hidden sm:block')}>
                  <div
                    className={cn(
                      'text-sm font-medium transition-colors',
                      isCompleted && 'text-primary',
                      isCurrent && 'text-foreground',
                      isUpcoming && 'text-muted-foreground',
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
                  )}
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'transition-colors duration-300',
                  isHorizontal ? 'flex-1 h-0.5 mx-4' : 'w-0.5 h-8 ml-5',
                  stepNumber < currentStep ? 'bg-primary' : 'bg-muted-foreground/30',
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// Minimal step indicator for tight spaces
export function StepDots({
  totalSteps,
  currentStep,
  className,
}: {
  totalSteps: number
  currentStep: number
  className?: string
}) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep

        return (
          <div
            key={index}
            className={cn(
              'h-2 w-2 rounded-full transition-all duration-300',
              isCompleted && 'bg-primary scale-110',
              isCurrent && 'bg-primary scale-125 animate-pulse',
              !isCompleted && !isCurrent && 'bg-muted-foreground/30',
            )}
          />
        )
      })}
    </div>
  )
}
