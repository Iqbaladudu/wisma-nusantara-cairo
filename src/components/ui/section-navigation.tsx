'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SectionNavigationProps {
  sections: Array<{
    id: string
    label: string
  }>
  className?: string
}

export function SectionNavigation({ sections, className }: SectionNavigationProps) {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={cn(
        'fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3',
        'hidden md:flex', // Hide on mobile for better UX
        className,
      )}
      aria-label="Section navigation"
    >
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className={cn(
            'w-3 h-3 rounded-full transition-all duration-300 hover:scale-125',
            'border-2 border-orange-400 dark:border-orange-300',
            activeSection === section.id
              ? 'bg-orange-500 dark:bg-orange-400 shadow-lg shadow-orange-500/50'
              : 'bg-transparent hover:bg-orange-200 dark:hover:bg-orange-800',
          )}
          aria-label={`Go to ${section.label} section`}
          title={section.label}
        />
      ))}
    </nav>
  )
}

interface ScrollIndicatorProps {
  className?: string
}

export function ScrollIndicator({ className }: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // Hide indicator after scrolling down a bit
      setIsVisible(window.scrollY < 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce',
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2 text-orange-600 dark:text-orange-400">
        <span className="text-xs sm:text-sm font-medium px-3 py-1 bg-white/80 dark:bg-gray-800/80 rounded-full backdrop-blur-sm">
          Scroll untuk melihat lebih
        </span>
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-orange-400 rounded-full flex justify-center">
          <div className="w-1 h-2 sm:h-3 bg-orange-500 rounded-full mt-1 sm:mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
