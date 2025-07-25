'use client'

import React from 'react'
import { PhoneInput as ReactInternationalPhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { cn } from '@/lib/utils'

interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  defaultCountry?: string
  hideDropdown?: boolean
  preferredCountries?: string[]
}

export function PhoneInputComponent({
  value,
  onChange,
  placeholder = 'Enter phone number',
  disabled = false,
  className,
  defaultCountry = 'eg', // Default to Egypt
  hideDropdown = false,
  preferredCountries = [], // Empty array to show all countries equally
  ...props
}: PhoneInputProps) {
  return (
    <div className={cn('modern-phone-input-wrapper', className)}>
      <ReactInternationalPhoneInput
        defaultCountry={defaultCountry}
        value={value}
        onChange={(phone) => onChange?.(phone)}
        placeholder={placeholder}
        disabled={disabled}
        hideDropdown={hideDropdown}
        preferredCountries={preferredCountries}
        showDisabledDialCodeAndPrefix={false}
        disableDialCodeAndPrefix={false}
        showSelectedLabel={true}
        limitMaxLength={false}
        {...props}
      />
      <style jsx global>{`
        .modern-phone-input-wrapper .react-international-phone-input-container {
          display: flex;
          align-items: center;
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
          background-color: hsl(var(--background));
          transition: all 0.2s ease-in-out;
          height: 44px;
        }

        .modern-phone-input-wrapper .react-international-phone-input-container:hover {
          border-color: hsl(var(--border));
        }

        .modern-phone-input-wrapper .react-international-phone-input-container:focus-within {
          outline: none;
          border-color: hsl(var(--ring));
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
        }

        .modern-phone-input-wrapper .react-international-phone-country-selector-button {
          border: none;
          background: transparent;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: hsl(var(--foreground));
          font-size: 14px;
          border-radius: calc(var(--radius) - 4px);
          transition: background-color 0.2s ease-in-out;
          min-width: 80px;
        }

        .modern-phone-input-wrapper .react-international-phone-country-selector-button:hover {
          background-color: hsl(var(--muted) / 0.5);
        }

        .modern-phone-input-wrapper .react-international-phone-country-selector-button:focus {
          outline: none;
          background-color: hsl(var(--muted) / 0.8);
        }

        .modern-phone-input-wrapper .react-international-phone-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 8px 12px;
          font-size: 14px;
          line-height: 1.5;
          color: hsl(var(--foreground));
          outline: none;
          height: 100%;
        }

        .modern-phone-input-wrapper .react-international-phone-input::placeholder {
          color: hsl(var(--muted-foreground));
        }

        .modern-phone-input-wrapper .react-international-phone-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Dropdown styling */
        .react-international-phone-country-selector-dropdown {
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius));
          background-color: hsl(var(--background)) !important;
          box-shadow:
            0 10px 15px -3px rgb(0 0 0 / 0.1),
            0 4px 6px -4px rgb(0 0 0 / 0.1);
          max-height: 300px;
          overflow-y: auto;
          z-index: 9999;
          margin-top: 4px;
          position: absolute;
        }

        .react-international-phone-country-selector-dropdown__list-item {
          padding: 12px 16px !important;
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          cursor: pointer !important;
          color: hsl(var(--foreground)) !important;
          font-size: 14px !important;
          transition: background-color 0.2s ease-in-out !important;
          border-bottom: 1px solid hsl(var(--border) / 0.5) !important;
          background-color: transparent !important;
        }

        .react-international-phone-country-selector-dropdown__list-item:last-child {
          border-bottom: none;
        }

        .react-international-phone-country-selector-dropdown__list-item:hover {
          background-color: hsl(var(--muted) / 0.5) !important;
        }

        .react-international-phone-country-selector-dropdown__list-item--focused {
          background-color: hsl(var(--muted) / 0.8) !important;
        }

        .react-international-phone-country-selector-dropdown__list-item--selected {
          background-color: hsl(var(--primary) / 0.1) !important;
          color: hsl(var(--primary)) !important;
          font-weight: 500 !important;
        }

        /* Country flag and name styling */
        .react-international-phone-country-selector-dropdown__list-item-flag-emoji {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .react-international-phone-country-selector-dropdown__list-item-country-name {
          flex: 1;
          font-weight: 400;
        }

        .react-international-phone-country-selector-dropdown__list-item-dial-code {
          color: hsl(var(--muted-foreground));
          font-size: 13px;
          font-weight: 500;
        }

        /* Search input styling */
        .react-international-phone-country-selector-dropdown__search-input {
          width: 100% !important;
          padding: 12px 16px !important;
          border: none !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          font-size: 14px !important;
          outline: none !important;
        }

        .react-international-phone-country-selector-dropdown__search-input::placeholder {
          color: hsl(var(--muted-foreground));
        }

        .react-international-phone-country-selector-dropdown__search-input:focus {
          border-bottom-color: hsl(var(--primary)) !important;
        }

        /* Strong fallback styling for better visibility */
        .react-international-phone-country-selector-dropdown {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .dark .react-international-phone-country-selector-dropdown {
          background: #1a1a1a !important;
          border: 1px solid #333 !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* Ensure dropdown items are visible */
        .react-international-phone-country-selector-dropdown__list-item {
          background: transparent !important;
          color: #1a1a1a !important;
        }

        .react-international-phone-country-selector-dropdown__list-item:hover {
          background-color: #f1f5f9 !important;
          color: #1a1a1a !important;
        }

        .dark .react-international-phone-country-selector-dropdown__list-item {
          color: #f8fafc !important;
        }

        .dark .react-international-phone-country-selector-dropdown__list-item:hover {
          background-color: #333 !important;
          color: #f8fafc !important;
        }

        /* Search input visibility */
        .react-international-phone-country-selector-dropdown__search-input {
          background: white !important;
          color: #1a1a1a !important;
        }

        .dark .react-international-phone-country-selector-dropdown__search-input {
          background: #1a1a1a !important;
          color: #f8fafc !important;
        }

        /* Enhanced dark mode support */
        .dark .react-international-phone-country-selector-dropdown {
          border-color: hsl(var(--border)) !important;
          background-color: hsl(var(--background)) !important;
        }

        .dark .react-international-phone-country-selector-dropdown__search-input {
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          border-bottom-color: hsl(var(--border)) !important;
        }

        /* Additional visibility fixes */
        .react-international-phone-country-selector-dropdown * {
          box-sizing: border-box;
        }

        /* Ensure proper stacking */
        .modern-phone-input-wrapper {
          position: relative;
        }

        .react-international-phone-country-selector-dropdown {
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 9999 !important;
          min-width: 100% !important;
          max-height: 300px !important;
          overflow-y: auto !important;
        }

        /* Fix for showing all countries */
        .react-international-phone-country-selector-dropdown__list {
          max-height: none !important;
          overflow: visible !important;
        }

        /* Ensure all countries are visible */
        .react-international-phone-country-selector-dropdown__list-item {
          display: flex !important;
        }

        /* Error state */
        .modern-phone-input-wrapper.error .react-international-phone-input-container {
          border-color: hsl(var(--destructive));
        }

        .modern-phone-input-wrapper.error .react-international-phone-input-container:focus-within {
          border-color: hsl(var(--destructive));
          box-shadow: 0 0 0 2px hsl(var(--destructive) / 0.2);
        }

        /* Success state */
        .modern-phone-input-wrapper.success .react-international-phone-input-container {
          border-color: hsl(var(--success, 142 76% 36%));
        }

        /* Disabled state */
        .modern-phone-input-wrapper
          .react-international-phone-input-container:has(
            .react-international-phone-input:disabled
          ) {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modern-phone-input-wrapper .react-international-phone-country-selector-button:disabled {
          cursor: not-allowed;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .react-international-phone-country-selector-dropdown {
            max-height: 250px;
          }

          .react-international-phone-country-selector-dropdown__list-item {
            padding: 10px 12px;
            font-size: 13px;
          }

          .react-international-phone-country-selector-dropdown__list-item-flag-emoji {
            font-size: 16px;
            width: 20px;
          }
        }

        /* Preferred countries separator */
        .react-international-phone-country-selector-dropdown__list-item--preferred {
          border-bottom: 2px solid hsl(var(--border));
          margin-bottom: 4px;
        }

        /* Custom scrollbar for dropdown */
        .react-international-phone-country-selector-dropdown::-webkit-scrollbar {
          width: 6px;
        }

        .react-international-phone-country-selector-dropdown::-webkit-scrollbar-track {
          background: hsl(var(--muted) / 0.3);
          border-radius: 3px;
        }

        .react-international-phone-country-selector-dropdown::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.5);
          border-radius: 3px;
        }

        .react-international-phone-country-selector-dropdown::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.7);
        }
      `}</style>
    </div>
  )
}

// Export with a more standard name
export { PhoneInputComponent as PhoneInput }
