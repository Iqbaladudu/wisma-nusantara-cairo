'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  iconColor?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'amber'
  className?: string
  animated?: boolean
}

const iconColorClasses = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400',
  green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400',
  red: 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400',
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = 'blue',
  className,
  animated = true,
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        'text-center group',
        animated && 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300',
        className,
      )}
      role="article"
      aria-label={`Feature: ${title}`}
    >
      <CardHeader>
        <div
          className={cn(
            'mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300',
            iconColorClasses[iconColor],
            animated && 'group-hover:scale-110',
          )}
          role="img"
          aria-label={`${title} icon`}
        >
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
        <CardTitle className="text-lg font-semibold">
          <h3>{title}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
