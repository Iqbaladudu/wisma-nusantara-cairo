'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  className?: string
  background?: 'default' | 'muted' | 'gradient'
  padding?: 'sm' | 'md' | 'lg'
  id?: string
  fullHeight?: boolean
  fullWidth?: boolean
}

const backgroundClasses = {
  default: '',
  muted: 'bg-gray-50 dark:bg-gray-800/50',
  gradient:
    'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
}

const paddingClasses = {
  sm: 'py-12 lg:py-16',
  md: 'py-20 lg:py-24',
  lg: 'py-24 lg:py-32',
}

export function Section({
  children,
  className,
  background = 'default',
  padding = 'lg',
  id,
  fullHeight = false,
  fullWidth = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        fullHeight ? 'min-h-screen flex items-center justify-center' : paddingClasses[padding],
        fullWidth ? 'w-full' : '',
        backgroundClasses[background],
        'relative',
        className,
      )}
      role="region"
      aria-label={id ? `${id.replace('-', ' ')} section` : 'Content section'}
    >
      <div
        className={cn(
          fullWidth ? 'w-full px-4' : 'container mx-auto px-4',
          fullHeight ? 'w-full max-w-7xl' : '',
        )}
      >
        {children}
      </div>
    </section>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({ title, subtitle, centered = true, className }: SectionHeaderProps) {
  return (
    <header className={cn(centered && 'text-center', 'mb-12 lg:mb-20', className)}>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
          role="doc-subtitle"
        >
          {subtitle}
        </p>
      )}
    </header>
  )
}
