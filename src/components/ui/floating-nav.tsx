'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Bed, Calendar, Phone, Info, Building2 } from 'lucide-react'
import { AnimatedButton } from '@/components/ui/animated-button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

interface FloatingNavProps {
  className?: string
}

export function FloatingNav({ className }: FloatingNavProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  const [lastScrollY, setLastScrollY] = React.useState(0)
  const [isMounted, setIsMounted] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Improved scroll behavior - only hide when scrolling down significantly
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Don't render on server to prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/hostel', icon: Bed, label: 'Hostel' },
    { href: '/auditorium', icon: Building2, label: 'Auditorium' },
  ]

  return (
    <nav
      className={cn(
        'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0',
        className,
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="card-flat rounded-full px-2 py-2 shadow-flat-lg border backdrop-blur-md">
        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className="relative">
                <AnimatedButton
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'relative group hover-lift rounded-full h-10 w-10 transition-all duration-200',
                    'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                    'touch-manipulation', // Better touch targets on mobile
                    isActive && 'bg-primary/10 text-primary',
                  )}
                  aria-label={item.label}
                >
                  <item.icon
                    className={cn('h-4 w-4 transition-all duration-200', isActive && 'scale-110')}
                  />

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}

                  {/* Enhanced tooltip with better positioning */}
                  <div
                    className={cn(
                      'absolute -top-12 left-1/2 transform -translate-x-1/2',
                      'bg-popover text-popover-foreground text-xs px-3 py-1.5 rounded-md',
                      'opacity-0 group-hover:opacity-100 transition-all duration-200',
                      'pointer-events-none whitespace-nowrap shadow-md border',
                      'before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2',
                      'before:border-4 before:border-transparent before:border-t-popover',
                    )}
                  >
                    {item.label}
                  </div>
                </AnimatedButton>
              </Link>
            )
          })}

          {/* Separator with better spacing */}
          <div className="w-px h-6 bg-border/60 mx-1" />

          {/* Theme Toggle with consistent sizing */}
          <div className="relative">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
