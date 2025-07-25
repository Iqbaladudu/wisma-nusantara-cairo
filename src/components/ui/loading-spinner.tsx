"use client"

import * as React from "react"
import { Loader2, Heart, Star, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "dots" | "pulse" | "heart" | "star"
  className?: string
  text?: string
}

export function LoadingSpinner({ 
  size = "md", 
  variant = "default", 
  className,
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  }

  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full bg-primary animate-bounce",
                  size === "sm" && "h-2 w-2",
                  size === "md" && "h-3 w-3",
                  size === "lg" && "h-4 w-4",
                  size === "xl" && "h-6 w-6"
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )
      
      case "pulse":
        return (
          <div className={cn(
            "rounded-full bg-primary animate-ping",
            sizeClasses[size]
          )} />
        )
      
      case "heart":
        return (
          <Heart className={cn(
            "text-primary animate-pulse",
            sizeClasses[size]
          )} />
        )
      
      case "star":
        return (
          <Star className={cn(
            "text-primary animate-spin",
            sizeClasses[size]
          )} />
        )
      
      default:
        return (
          <Loader2 className={cn(
            "animate-spin text-primary",
            sizeClasses[size]
          )} />
        )
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <div className="relative">
        {renderSpinner()}
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" />
      </div>
      
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// Full page loading component
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="glass rounded-2xl p-8 shadow-2xl border border-primary/20">
        <LoadingSpinner 
          size="xl" 
          variant="heart" 
          text={text}
          className="animate-scale-in"
        />
      </div>
    </div>
  )
}

// Inline loading component
export function InlineLoader({ 
  text = "Loading...", 
  size = "md" 
}: { 
  text?: string
  size?: "sm" | "md" | "lg" 
}) {
  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <LoadingSpinner size={size} variant="dots" />
      <span className="text-muted-foreground">{text}</span>
    </div>
  )
}
