'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureListItem {
  icon: LucideIcon
  title: string
  description: string
  iconColor?: 'blue' | 'green' | 'purple' | 'orange' | 'amber'
}

interface FeatureListProps {
  items: FeatureListItem[]
  className?: string
}

const iconColorClasses = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400',
  green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400',
}

export function FeatureList({ items, className }: FeatureListProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-4 group">
          <div
            className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
              iconColorClasses[item.iconColor || 'blue']
            )}
          >
            <item.icon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
