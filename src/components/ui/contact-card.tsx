'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ContactCardProps {
  icon: LucideIcon
  title: string
  value: string
  href?: string
  iconColor?: 'blue' | 'green' | 'purple' | 'orange'
  className?: string
}

const iconColorClasses = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400',
  green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400',
}

export function ContactCard({
  icon: Icon,
  title,
  value,
  href,
  iconColor = 'blue',
  className,
}: ContactCardProps) {
  const content = (
    <Card className={cn('text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1', className)}>
      <CardContent className="pt-6">
        <div
          className={cn(
            'mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110',
            iconColorClasses[iconColor]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 font-medium">{value}</p>
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <a 
        href={href} 
        className="block transition-transform duration-200 hover:scale-105"
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    )
  }

  return content
}
