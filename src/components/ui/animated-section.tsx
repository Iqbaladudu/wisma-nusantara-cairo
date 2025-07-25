'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animation?: 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'none'
  delay?: number
}

export function AnimatedSection({
  children,
  className,
  animation = 'fade-in',
  delay = 0,
}: AnimatedSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  })

  const animationClasses = {
    'fade-in': 'animate-fade-in',
    'slide-in-left': 'animate-slide-in-left',
    'slide-in-right': 'animate-slide-in-right',
    'none': '',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-300',
        !isIntersecting && animation !== 'none' && 'opacity-0 translate-y-8',
        isIntersecting && animation !== 'none' && animationClasses[animation],
        className
      )}
      style={{
        animationDelay: isIntersecting ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  )
}
