'use client'

import React from 'react'
import Link from 'next/link'
import {
  MapPin,
  Phone,
  Mail,
  Users,
  Wifi,
  Coffee,
  Shield,
  Award,
  Home,
  ArrowRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { BookingOptionsSummary } from '@/components/booking-options-summary'
import { HeroSection } from '@/components/sections/hero-section'
import { FeatureCard } from '@/components/ui/feature-card'
import { TestimonialCard } from '@/components/ui/testimonial-card'
import { ContactCard } from '@/components/ui/contact-card'
import { Section, SectionHeader } from '@/components/ui/section'
import { FeatureList } from '@/components/ui/feature-list'
import { StatsGrid } from '@/components/ui/stats-grid'
import { AnimatedSection } from '@/components/ui/animated-section'
import { SectionNavigation, ScrollIndicator } from '@/components/ui/section-navigation'
import { BackgroundPattern, FloatingElements } from '@/components/ui/background-pattern'

export default function HomePage() {
  const sections = [
    { id: 'hero', label: 'Beranda' },
    { id: 'features', label: 'Fitur' },
    { id: 'booking-options', label: 'Booking' },
    { id: 'about', label: 'Tentang' },
    { id: 'contact', label: 'Kontak' },
  ]

  return (
    <div className="w-full overflow-x-hidden relative">
      {/* Section Navigation */}
      <SectionNavigation sections={sections} />

      {/* Scroll Indicator */}
      <ScrollIndicator />
      {/* Hero Section */}
      <div id="hero">
        <HeroSection
          title="Wisma Nusantara Cairo"
          subtitle="Habibie's Heritage in Cairo"
          primaryCTA={{
            text: 'Mulai Booking',
            href: '#booking-options',
          }}
          secondaryCTA={{
            text: 'Pelajari Lebih Lanjut',
            href: '#about',
          }}
          stats={[
            { value: '9', label: 'Kamar Tersedia', color: 'blue' },
            { value: '80-100', label: 'Kapasitas Auditorium', color: 'green' },
            { value: '5★', label: 'Rating', color: 'orange' },
          ]}
        />
      </div>

      {/* Features Section */}
      <Section
        id="features"
        fullHeight={true}
        fullWidth={true}
        background="gradient"
        className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative"
      >
        <BackgroundPattern variant="dots" className="opacity-30" />
        <FloatingElements count={3} />
        <div className="text-center w-full relative z-10">
          <SectionHeader
            title="Mengapa Memilih Wisma Nusantara?"
            subtitle="Fasilitas lengkap dan pelayanan terbaik untuk kenyamanan Anda di Cairo"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
            <AnimatedSection delay={0}>
              <FeatureCard
                icon={MapPin}
                title="Lokasi Strategis"
                description="Terletak di pusat kota Cairo dengan akses mudah ke berbagai tempat penting"
                iconColor="orange"
              />
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <FeatureCard
                icon={Shield}
                title="Keamanan 24/7"
                description="Sistem keamanan terpadu dengan petugas keamanan yang berjaga 24 jam"
                iconColor="green"
              />
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <FeatureCard
                icon={Wifi}
                title="WiFi Gratis"
                description="Internet berkecepatan tinggi tersedia di seluruh area wisma"
                iconColor="blue"
              />
            </AnimatedSection>
            <AnimatedSection delay={300}>
              <FeatureCard
                icon={Coffee}
                title="Fasilitas Lengkap"
                description="Dapur bersama, ruang santai, dan berbagai fasilitas penunjang lainnya"
                iconColor="amber"
              />
            </AnimatedSection>
          </div>
        </div>
      </Section>

      {/* Booking Options Section */}
      <Section id="booking-options" background="muted" fullHeight={true} fullWidth={true}>
        <div className="w-full max-w-7xl mx-auto">
          <BookingOptionsSummary />
        </div>
      </Section>

      {/* About Section */}
      <Section
        id="about"
        fullHeight={true}
        fullWidth={true}
        background="gradient"
        className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative"
      >
        <BackgroundPattern variant="geometric" className="opacity-20" />
        <FloatingElements count={4} />
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <SectionHeader
            title="Tentang Wisma Nusantara Cairo"
            subtitle="Lebih dari sekadar tempat menginap - kami adalah rumah kedua Anda di Mesir"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
            <AnimatedSection animation="slide-in-left">
              <FeatureList
                items={[
                  {
                    icon: Home,
                    title: 'Rumah Bagi Diaspora Indonesia',
                    description:
                      'Wisma Nusantara Cairo telah menjadi rumah kedua bagi ribuan mahasiswa, profesional, dan wisatawan Indonesia di Mesir sejak tahun 1995.',
                    iconColor: 'orange',
                  },
                  {
                    icon: Users,
                    title: 'Komunitas yang Hangat',
                    description:
                      'Bergabunglah dengan komunitas Indonesia yang solid dan saling mendukung dalam perjalanan hidup di negeri Piramida.',
                    iconColor: 'green',
                  },
                  {
                    icon: Award,
                    title: 'Standar Kualitas Tinggi',
                    description:
                      'Fasilitas modern dengan standar internasional namun tetap mempertahankan kehangatan budaya Indonesia.',
                    iconColor: 'amber',
                  },
                ]}
              />
            </AnimatedSection>

            <AnimatedSection animation="slide-in-right" delay={200}>
              <div className="space-y-6">
                <TestimonialCard
                  quote="Wisma Nusantara bukan hanya tempat menginap, tapi benar-benar rumah kedua. Staf yang ramah, fasilitas lengkap, dan suasana kekeluargaan yang hangat membuat saya merasa di rumah sendiri."
                  author={{
                    name: 'Ahmad Rizki',
                    title: 'Mahasiswa Al-Azhar',
                  }}
                  rating={5}
                />

                <StatsGrid
                  stats={[
                    { value: '25+', label: 'Tahun Pengalaman', color: 'orange' },
                    { value: '10K+', label: 'Tamu Puas', color: 'green' },
                  ]}
                  columns={2}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </Section>

      {/* Contact Section */}
      <Section id="contact" background="muted" fullHeight={true} fullWidth={true}>
        <div className="max-w-6xl mx-auto text-center w-full">
          <SectionHeader
            title="Siap Memulai Perjalanan Anda?"
            subtitle="Tim kami siap membantu Anda menemukan akomodasi dan fasilitas yang tepat"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            <ContactCard
              icon={Phone}
              title="Telepon"
              value="+20 123 456 7890"
              href="tel:+201234567890"
              iconColor="orange"
            />
            <ContactCard
              icon={Mail}
              title="Email"
              value="info@wismanusantara.com"
              href="mailto:info@wismanusantara.com"
              iconColor="green"
            />
            <ContactCard
              icon={MapPin}
              title="Alamat"
              value="Heliopolis, Cairo, Egypt"
              iconColor="blue"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px] touch-manipulation text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
            >
              <Link href="#booking-options">
                Booking Sekarang
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-800 dark:hover:border-orange-700 dark:hover:bg-orange-950/20 transition-all duration-300 min-h-[48px] touch-manipulation text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
            >
              <a href="https://wa.me/201234567890" target="_blank" rel="noopener noreferrer">
                WhatsApp Kami
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
}
