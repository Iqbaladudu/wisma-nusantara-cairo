import { getPayload } from 'payload'
import config from '../src/payload.config'
import { seedSampleData } from '../src/lib/seed-data'

// Load environment variables
import dotenv from 'dotenv'
dotenv.config()

const seed = async () => {
  try {
    console.log('🚀 Initializing Payload...')

    const payload = await getPayload({
      config,
    })

    console.log('✅ Payload initialized successfully')

    await seedSampleData(payload)

    console.log('🎉 Seeding completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
