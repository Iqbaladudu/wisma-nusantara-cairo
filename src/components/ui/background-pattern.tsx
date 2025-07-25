'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface BackgroundPatternProps {
  variant?: 'dots' | 'grid' | 'waves' | 'geometric'
  className?: string
  opacity?: number
}

export function BackgroundPattern({ 
  variant = 'dots', 
  className, 
  opacity = 0.1 
}: BackgroundPatternProps) {
  const patterns = {
    dots: (
      <svg width="60" height="60" viewBox="0 0 60 60" className="w-full h-full">
        <circle cx="30" cy="30" r="2" fill="currentColor" opacity={opacity} />
      </svg>
    ),
    grid: (
      <svg width="40" height="40" viewBox="0 0 40 40" className="w-full h-full">
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity={opacity}
        />
      </svg>
    ),
    waves: (
      <svg width="100" height="20" viewBox="0 0 100 20" className="w-full h-full">
        <path
          d="M0,10 Q25,0 50,10 T100,10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity={opacity}
        />
      </svg>
    ),
    geometric: (
      <svg width="80" height="80" viewBox="0 0 80 80" className="w-full h-full">
        <polygon
          points="40,10 60,30 40,50 20,30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity={opacity}
        />
      </svg>
    ),
  }

  return (
    <div
      className={cn(
        'absolute inset-0 w-full h-full pointer-events-none',
        'text-orange-400 dark:text-orange-600',
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
          patterns[variant].props.children || ''
        )}")`,
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20 dark:to-gray-900/20" />
    </div>
  )
}

interface FloatingElementsProps {
  className?: string
  count?: number
}

export function FloatingElements({ className, count = 5 }: FloatingElementsProps) {
  const elements = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 10,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
  }))

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute rounded-full bg-gradient-to-br from-orange-200 to-amber-200 dark:from-orange-800 dark:to-amber-800 opacity-20 animate-float"
          style={{
            width: `${element.size}px`,
            height: `${element.size}px`,
            left: `${element.left}%`,
            top: `${element.top}%`,
            animationDelay: `${element.delay}s`,
            animationDuration: `${element.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
