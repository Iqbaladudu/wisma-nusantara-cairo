'use client'

import React, { useState } from 'react'
import { PhoneFormField, PHONE_CONFIGS } from '@/components/ui/phone-form-field'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TestFormData {
  phone1: string
  phone2: string
  phone3: string
}

export function PhoneInputTest() {
  const form = useForm<TestFormData>({
    defaultValues: {
      phone1: '',
      phone2: '',
      phone3: '',
    },
  })

  const [results, setResults] = useState<TestFormData | null>(null)

  const onSubmit = (data: TestFormData) => {
    setResults(data)
    console.log('Phone Input Test Results:', data)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Phone Input Test - All Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Test 1: ALL_COUNTRIES config */}
            <div>
              <h3 className="text-lg font-medium mb-3">Test 1: ALL_COUNTRIES Config</h3>
              <PhoneFormField
                control={form.control}
                name="phone1"
                label="Phone (All Countries)"
                description="Should show ALL countries without prioritization"
                placeholder="Select any country and enter number"
                {...PHONE_CONFIGS.ALL_COUNTRIES}
              />
            </div>

            {/* Test 2: ALL_EQUAL config */}
            <div>
              <h3 className="text-lg font-medium mb-3">Test 2: ALL_EQUAL Config</h3>
              <PhoneFormField
                control={form.control}
                name="phone2"
                label="Phone (All Equal)"
                description="Should show ALL countries with undefined preferred"
                placeholder="Select any country and enter number"
                {...PHONE_CONFIGS.ALL_EQUAL}
              />
            </div>

            {/* Test 3: Custom config with empty preferred */}
            <div>
              <h3 className="text-lg font-medium mb-3">Test 3: Custom Empty Preferred</h3>
              <PhoneFormField
                control={form.control}
                name="phone3"
                label="Phone (Custom)"
                description="Custom config with empty preferredCountries array"
                placeholder="Select any country and enter number"
                defaultCountry="eg"
                preferredCountries={[]}
              />
            </div>

            <Button type="submit" className="w-full">
              Test Phone Inputs
            </Button>
          </form>

          {results && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-medium mb-2">Test Results:</h4>
              <pre className="text-sm">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected Countries (Sample)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div>🇦🇫 Afghanistan (+93)</div>
            <div>🇦🇱 Albania (+355)</div>
            <div>🇩🇿 Algeria (+213)</div>
            <div>🇦🇩 Andorra (+376)</div>
            <div>🇦🇴 Angola (+244)</div>
            <div>🇦🇷 Argentina (+54)</div>
            <div>🇦🇲 Armenia (+374)</div>
            <div>🇦🇺 Australia (+61)</div>
            <div>🇦🇹 Austria (+43)</div>
            <div>🇦🇿 Azerbaijan (+994)</div>
            <div>🇧🇭 Bahrain (+973)</div>
            <div>🇧🇩 Bangladesh (+880)</div>
            <div>🇧🇪 Belgium (+32)</div>
            <div>🇧🇷 Brazil (+55)</div>
            <div>🇧🇬 Bulgaria (+359)</div>
            <div>🇨🇦 Canada (+1)</div>
            <div>🇨🇳 China (+86)</div>
            <div>🇨🇴 Colombia (+57)</div>
            <div>🇨🇷 Costa Rica (+506)</div>
            <div>🇭🇷 Croatia (+385)</div>
            <div>🇨🇿 Czech Republic (+420)</div>
            <div>🇩🇰 Denmark (+45)</div>
            <div>🇪🇬 Egypt (+20)</div>
            <div>🇪🇪 Estonia (+372)</div>
            <div>🇫🇮 Finland (+358)</div>
            <div>🇫🇷 France (+33)</div>
            <div>🇩🇪 Germany (+49)</div>
            <div>🇬🇷 Greece (+30)</div>
            <div>🇭🇰 Hong Kong (+852)</div>
            <div>🇭🇺 Hungary (+36)</div>
            <div>🇮🇸 Iceland (+354)</div>
            <div>🇮🇳 India (+91)</div>
            <div>🇮🇩 Indonesia (+62)</div>
            <div>🇮🇷 Iran (+98)</div>
            <div>🇮🇶 Iraq (+964)</div>
            <div>🇮🇪 Ireland (+353)</div>
            <div>🇮🇱 Israel (+972)</div>
            <div>🇮🇹 Italy (+39)</div>
            <div>🇯🇵 Japan (+81)</div>
            <div>🇯🇴 Jordan (+962)</div>
            <div>🇰🇿 Kazakhstan (+7)</div>
            <div>🇰🇪 Kenya (+254)</div>
            <div>🇰🇼 Kuwait (+965)</div>
            <div>🇱🇧 Lebanon (+961)</div>
            <div>🇱🇾 Libya (+218)</div>
            <div>🇲🇾 Malaysia (+60)</div>
            <div>🇲🇽 Mexico (+52)</div>
            <div>🇲🇦 Morocco (+212)</div>
            <div>🇳🇱 Netherlands (+31)</div>
            <div>🇳🇿 New Zealand (+64)</div>
            <div>🇳🇬 Nigeria (+234)</div>
            <div>🇳🇴 Norway (+47)</div>
            <div>🇴🇲 Oman (+968)</div>
            <div>🇵🇰 Pakistan (+92)</div>
            <div>🇵🇭 Philippines (+63)</div>
            <div>🇵🇱 Poland (+48)</div>
            <div>🇵🇹 Portugal (+351)</div>
            <div>🇶🇦 Qatar (+974)</div>
            <div>🇷🇴 Romania (+40)</div>
            <div>🇷🇺 Russia (+7)</div>
            <div>🇸🇦 Saudi Arabia (+966)</div>
            <div>🇸🇬 Singapore (+65)</div>
            <div>🇸🇰 Slovakia (+421)</div>
            <div>🇸🇮 Slovenia (+386)</div>
            <div>🇿🇦 South Africa (+27)</div>
            <div>🇰🇷 South Korea (+82)</div>
            <div>🇪🇸 Spain (+34)</div>
            <div>🇱🇰 Sri Lanka (+94)</div>
            <div>🇸🇪 Sweden (+46)</div>
            <div>🇨🇭 Switzerland (+41)</div>
            <div>🇸🇾 Syria (+963)</div>
            <div>🇹🇼 Taiwan (+886)</div>
            <div>🇹🇭 Thailand (+66)</div>
            <div>🇹🇳 Tunisia (+216)</div>
            <div>🇹🇷 Turkey (+90)</div>
            <div>🇺🇦 Ukraine (+380)</div>
            <div>🇦🇪 UAE (+971)</div>
            <div>🇬🇧 United Kingdom (+44)</div>
            <div>🇺🇸 United States (+1)</div>
            <div>🇺🇿 Uzbekistan (+998)</div>
            <div>🇻🇪 Venezuela (+58)</div>
            <div>🇻🇳 Vietnam (+84)</div>
            <div>🇾🇪 Yemen (+967)</div>
            <div>🇿🇼 Zimbabwe (+263)</div>
            <div className="col-span-2 md:col-span-4 text-center font-medium mt-2">
              ... and 150+ more countries!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
