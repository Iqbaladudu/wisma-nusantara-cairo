'use client'

import React from 'react'
import { Star, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TestimonialCardProps {
  quote: string
  author: {
    name: string
    title: string
    avatar?: string
  }
  rating?: number
}

export function TestimonialCard({ quote, author, rating = 5 }: TestimonialCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          <span className="text-lg">Testimoni Tamu</span>
          {rating && (
            <div className="flex ml-auto">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <blockquote className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
          "{quote}"
        </blockquote>
        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950/20 dark:to-amber-950/20 rounded-full flex items-center justify-center">
            {author.avatar ? (
              <img 
                src={author.avatar} 
                alt={author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{author.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{author.title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
