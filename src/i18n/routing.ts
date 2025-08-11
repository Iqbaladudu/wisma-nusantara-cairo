import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'id', 'ar'],

  // Always use Indonesian ('id') if no locale is provided or matched
  defaultLocale: 'id',
  localePrefix: 'as-needed',
})
