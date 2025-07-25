'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface StatItem {
  value: string
  label: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'amber'
}

interface StatsGridProps {
  stats: StatItem[]
  columns?: 2 | 3 | 4
  className?: string
}

const colorClasses = {
  blue: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400',
  green: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400',
  purple: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400',
  orange: 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400',
  amber: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400',
}

export function StatsGrid({ stats, columns = 2, className }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  return (
    <div className={cn(`grid ${gridCols[columns]} gap-4`, className)}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            'text-center p-4 rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-1',
            colorClasses[stat.color || 'blue']
          )}
        >
          <div className="text-2xl font-bold mb-1">{stat.value}</div>
          <div className="text-sm font-medium opacity-80">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
