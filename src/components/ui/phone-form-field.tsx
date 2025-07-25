'use client'

import React from 'react'
import { Control, FieldPath, FieldValues } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PhoneInput } from '@/components/ui/phone-input'
import { cn } from '@/lib/utils'

interface PhoneFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label?: string
  description?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  defaultCountry?: string
  preferredCountries?: string[]
  hideDropdown?: boolean
  icon?: React.ReactNode
}

export function PhoneFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder,
  disabled = false,
  className,
  defaultCountry = 'eg',
  preferredCountries,
  hideDropdown = false,
  icon,
}: PhoneFormFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className={cn('flex items-center gap-2', icon && 'gap-2')}>
              {icon}
              {label}
            </FormLabel>
          )}
          <FormControl>
            <PhoneInput
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder}
              disabled={disabled}
              defaultCountry={defaultCountry}
              preferredCountries={preferredCountries}
              hideDropdown={hideDropdown}
              className={cn(
                fieldState.error && 'error',
                !fieldState.error && field.value && 'success',
              )}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Predefined preferred countries for common use cases
export const PREFERRED_COUNTRIES = {
  // Middle East & North Africa
  MENA: [
    'eg',
    'sa',
    'ae',
    'qa',
    'kw',
    'bh',
    'om',
    'jo',
    'lb',
    'sy',
    'iq',
    'ye',
    'ma',
    'tn',
    'dz',
    'ly',
    'sd',
  ],

  // Southeast Asia
  ASEAN: ['id', 'my', 'sg', 'th', 'ph', 'vn', 'mm', 'kh', 'la', 'bn'],

  // Popular international
  POPULAR: [
    'eg',
    'id',
    'my',
    'sg',
    'sa',
    'ae',
    'us',
    'gb',
    'de',
    'fr',
    'it',
    'es',
    'au',
    'ca',
    'jp',
    'kr',
    'cn',
    'in',
  ],

  // Top 20 most used countries
  TOP_20: [
    'eg',
    'us',
    'gb',
    'de',
    'fr',
    'it',
    'es',
    'ca',
    'au',
    'jp',
    'kr',
    'cn',
    'in',
    'id',
    'my',
    'sg',
    'sa',
    'ae',
    'br',
    'mx',
  ],

  // No preferred countries (all countries shown equally)
  NONE: [],
}

// Predefined configurations for different contexts
export const PHONE_CONFIGS = {
  // For Egypt-based services (Egypt as default, MENA countries prioritized)
  EGYPT_FOCUSED: {
    defaultCountry: 'eg' as const,
    preferredCountries: PREFERRED_COUNTRIES.MENA,
  },

  // For international services (popular countries prioritized)
  INTERNATIONAL: {
    defaultCountry: 'eg' as const,
    preferredCountries: PREFERRED_COUNTRIES.POPULAR,
  },

  // For ASEAN region services
  ASEAN_FOCUSED: {
    defaultCountry: 'id' as const,
    preferredCountries: PREFERRED_COUNTRIES.ASEAN,
  },

  // All countries available with top 20 prioritized
  GLOBAL: {
    defaultCountry: 'eg' as const,
    preferredCountries: PREFERRED_COUNTRIES.TOP_20,
  },

  // All countries with no prioritization
  ALL_EQUAL: {
    defaultCountry: 'eg' as const,
    preferredCountries: undefined, // Show all countries without prioritization
  },

  // Truly all countries (no preferred, no restrictions)
  ALL_COUNTRIES: {
    defaultCountry: 'eg' as const,
    preferredCountries: [], // Empty array means no preferred countries
  },
}
