'use client'

import React from 'react'
import Link from 'next/link'
import { Building2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  title: string
  subtitle: string
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA: {
    text: string
    href: string
  }
  stats: Array<{
    value: string
    label: string
    color: 'blue' | 'green' | 'orange' | 'purple'
  }>
}

const statColorClasses = {
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-emerald-600 dark:text-emerald-400',
  orange: 'text-orange-600 dark:text-orange-400',
  purple: 'text-purple-600 dark:text-purple-400',
}

export function HeroSection({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  stats,
}: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      aria-label="Hero section"
      role="banner"
    >
      <div className="absolute inset-0 w-full h-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          <div className="text-center max-w-6xl mx-auto w-full py-8 sm:py-0">
            {/* Logo and Title */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-3 mb-8 animate-fade-in">
              <div
                className="w-16 h-16 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer"
                role="img"
                aria-label="Wisma Nusantara Cairo logo"
              >
                <Building2 className="h-8 w-8 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
              </div>
              <h1
                className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-amber-700 dark:from-white dark:via-orange-200 dark:to-amber-300 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 text-center sm:text-left"
                id="main-heading"
              >
                {title}
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed font-medium max-w-3xl mx-auto">
              {subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16 px-4 sm:px-0">
              <Button
                size="lg"
                asChild
                className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px] touch-manipulation"
              >
                <Link href={primaryCTA.href}>
                  {primaryCTA.text}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-800 dark:hover:border-orange-700 dark:hover:bg-orange-950/20 transition-all duration-300 min-h-[48px] touch-manipulation"
              >
                <Link href={secondaryCTA.href}>{secondaryCTA.text}</Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto px-4 sm:px-0"
              role="region"
              aria-label="Key statistics"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group p-4 sm:p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-orange-100 dark:border-orange-900/20 hover:shadow-lg transition-all duration-300 min-h-[120px] flex flex-col justify-center"
                  role="article"
                  aria-label={`${stat.label}: ${stat.value}`}
                >
                  <div
                    className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 transition-transform duration-300 group-hover:scale-110 ${statColorClasses[stat.color]}`}
                    aria-hidden="true"
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[5%] w-20 h-20 bg-orange-200 dark:bg-orange-800 rounded-full opacity-20 animate-pulse animate-float"></div>
        <div className="absolute top-[20%] right-[10%] w-16 h-16 bg-amber-200 dark:bg-amber-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-[15%] left-[8%] w-24 h-24 bg-emerald-200 dark:bg-emerald-800 rounded-full opacity-20 animate-pulse delay-2000 animate-float"></div>
        <div className="absolute top-[60%] right-[5%] w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full opacity-15 animate-pulse delay-3000"></div>
        <div className="absolute bottom-[40%] right-[15%] w-18 h-18 bg-pink-200 dark:bg-pink-800 rounded-full opacity-15 animate-pulse delay-4000 animate-float"></div>
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-orange-50/30 dark:to-gray-900/30 -z-5"></div>
    </section>
  )
}
