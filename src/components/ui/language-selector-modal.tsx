'use client'

import React from 'react'
import { Globe } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, getPathname, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const LANGS: Array<{ code: 'id' | 'en' | 'ar'; labelKey: keyof typeof LABEL_KEYS }> = [
  { code: 'id', labelKey: 'id' },
  { code: 'en', labelKey: 'en' },
  { code: 'ar', labelKey: 'ar' },
]

const LABEL_KEYS = {
  id: 'common.languageSwitcher.id',
  en: 'common.languageSwitcher.en',
  ar: 'common.languageSwitcher.ar',
  button: 'common.languageSwitcher.button',
  title: 'common.languageSwitcher.title',
  desc: 'common.languageSwitcher.desc',
} as const

export function LanguageSelectorModal() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale() as 'id' | 'en' | 'ar'
  const t = useTranslations()

  const onSelect = (code: 'id' | 'en' | 'ar') => {
    if (code === locale) return

    const segments = (pathname || '/').split('/')
    const first = segments[1]
    const withoutLocale = routing.locales.includes(first as (typeof routing.locales)[number])
      ? '/' + segments.slice(2).join('/')
      : pathname || '/'

    // normalisasi tanpa trailing slash
    const normalized = (withoutLocale || '/').replace(/\/+$/, '') || '/'
    const adminBase = '/admin'

    // Jika path admin, jangan tambahkan prefix locale — tetap /admin
    if (normalized === adminBase || normalized.startsWith(adminBase + '/')) {
      router.push(adminBase)
      return
    }

    const href = getPathname({ href: withoutLocale || '/', locale: code, forcePrefix: true })
    router.push(href)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {t(LABEL_KEYS.button)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t(LABEL_KEYS.title)}</DialogTitle>
          <DialogDescription>{t(LABEL_KEYS.desc)}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2">
          {LANGS.map(({ code, labelKey }) => (
            <Button
              key={code}
              variant={locale === code ? 'default' : 'secondary'}
              className="justify-between"
              onClick={() => onSelect(code)}
            >
              <span>{t(LABEL_KEYS[labelKey])}</span>
              {locale === code ? (
                <span className="text-xs opacity-75">{t('common.languageSwitcher.current')}</span>
              ) : null}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LanguageSelectorModal
