'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'

export function DevIndicator() {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800">
        DEV
      </Badge>
    </div>
  )
}
