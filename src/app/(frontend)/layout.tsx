import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, setRequestLocale } from 'next-intl/server'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { FloatingNav } from '@/components/ui/floating-nav'
import { DevIndicator } from '@/components/ui/dev-indicator'
import { notFound } from 'next/navigation'

import './styles.css'

// Configure Jakarta Sans Pro font
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta-sans',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata = {
  title: 'Wisma Nusantara Cairo - Rumah Kedua Anda di Mesir',
  description:
    'Akomodasi nyaman dan fasilitas lengkap untuk mahasiswa, profesional, dan wisatawan Indonesia di Cairo. Book hostel accommodation and auditorium facilities at Wisma Nusantara Cairo.',
  keywords:
    'wisma nusantara, cairo, egypt, hostel, auditorium, booking, indonesia, accommodation, mesir',
  openGraph: {
    title: 'Wisma Nusantara Cairo - Rumah Kedua Anda di Mesir',
    description:
      'Akomodasi nyaman dan fasilitas lengkap untuk mahasiswa, profesional, dan wisatawan Indonesia di Cairo.',
    type: 'website',
    locale: 'id_ID',
  },
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const locale = await getLocale()

  setRequestLocale(locale)

  const messages = await getMessages()

  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} className={jakartaSans.variable}>
      <body className={jakartaSans.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main>{children}</main>
            <FloatingNav />
            <DevIndicator />
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
