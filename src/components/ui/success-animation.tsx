"use client"

import * as React from "react"
import { Check, Heart, Star, Sparkles, PartyPopper } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { cn } from "@/lib/utils"

interface SuccessAnimationProps {
  title?: string
  message?: string
  onContinue?: () => void
  onClose?: () => void
  variant?: "default" | "celebration" | "minimal"
  className?: string
}

export function SuccessAnimation({
  title = "Success!",
  message = "Your action was completed successfully.",
  onContinue,
  onClose,
  variant = "default",
  className
}: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  const renderIcon = () => {
    switch (variant) {
      case "celebration":
        return (
          <div className="relative">
            <div className="p-4 bg-success rounded-full shadow-glow-green animate-bounce-gentle">
              <PartyPopper className="h-8 w-8 text-success-foreground" />
            </div>
            {/* Confetti effect */}
            <div className="absolute -top-2 -left-2">
              <Sparkles className="h-4 w-4 text-warning animate-ping" />
            </div>
            <div className="absolute -top-1 -right-3">
              <Star className="h-3 w-3 text-primary animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -left-3">
              <Heart className="h-3 w-3 text-destructive animate-bounce" />
            </div>
          </div>
        )
      
      case "minimal":
        return (
          <div className="p-3 bg-success/10 rounded-full">
            <Check className="h-6 w-6 text-success" />
          </div>
        )
      
      default:
        return (
          <div className="relative">
            <div className="p-4 bg-success rounded-full shadow-glow-green animate-scale-in">
              <Check className="h-8 w-8 text-success-foreground" />
            </div>
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-success/10 animate-ping" style={{ animationDelay: '0.2s' }} />
          </div>
        )
    }
  }

  if (!isVisible) return null

  return (
    <div className={cn(
      "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",
      className
    )}>
      <div className={cn(
        "glass rounded-2xl p-8 shadow-2xl border border-success/20 max-w-md w-full text-center animate-scale-in",
        variant === "minimal" && "p-6"
      )}>
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {renderIcon()}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className={cn(
            "font-bold text-foreground",
            variant === "celebration" ? "text-2xl text-gradient-animated" : "text-xl",
            variant === "minimal" && "text-lg"
          )}>
            {title}
          </h2>
          
          <p className="text-muted-foreground">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className={cn(
          "flex gap-3 mt-8",
          variant === "minimal" && "mt-6"
        )}>
          {onClose && (
            <AnimatedButton
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </AnimatedButton>
          )}
          
          {onContinue && (
            <AnimatedButton
              variant="gradient"
              onClick={onContinue}
              className="flex-1 shadow-glow-green"
              rightIcon={<Heart className="h-4 w-4" />}
            >
              Continue
            </AnimatedButton>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook for managing success state
export function useSuccessAnimation() {
  const [isShowing, setIsShowing] = React.useState(false)
  const [config, setConfig] = React.useState<Partial<SuccessAnimationProps>>({})

  const showSuccess = React.useCallback((options: Partial<SuccessAnimationProps> = {}) => {
    setConfig(options)
    setIsShowing(true)
  }, [])

  const hideSuccess = React.useCallback(() => {
    setIsShowing(false)
  }, [])

  const SuccessComponent = React.useCallback(() => {
    if (!isShowing) return null
    
    return (
      <SuccessAnimation
        {...config}
        onClose={hideSuccess}
      />
    )
  }, [isShowing, config, hideSuccess])

  return {
    showSuccess,
    hideSuccess,
    SuccessComponent,
    isShowing
  }
}
