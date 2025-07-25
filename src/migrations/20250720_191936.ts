import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  try {
    // Add price column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE "hostel_bookings" ADD COLUMN IF NOT EXISTS "price" numeric;
    `)

    // Add pricing columns if they don't exist (for compatibility)
    await db.execute(sql`
      ALTER TABLE "hostel_bookings" ADD COLUMN IF NOT EXISTS "pricing_base_price" numeric;
    `)

    await db.execute(sql`
      ALTER TABLE "hostel_bookings" ADD COLUMN IF NOT EXISTS "pricing_seasonal_multiplier" numeric;
    `)

    await db.execute(sql`
      ALTER TABLE "hostel_bookings" ADD COLUMN IF NOT EXISTS "pricing_weekend_multiplier" numeric;
    `)

    await db.execute(sql`
      ALTER TABLE "hostel_bookings" ADD COLUMN IF NOT EXISTS "pricing_coupon_discount" numeric;
    `)

    await db.execute(sql`
      ALTER TABLE "hostel_bookings" ADD COLUMN IF NOT EXISTS "pricing_final_price" numeric NOT NULL DEFAULT 0;
    `)

    await db.execute(sql`
      ALTER TABLE "hostel_bookings" ADD COLUMN IF NOT EXISTS "pricing_price_breakdown" varchar;
    `)

    console.log('✅ Hostel bookings table updated successfully')
  } catch (error) {
    console.error('❌ Error updating hostel bookings table:', error)
    throw error
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "hostel_bookings" ADD COLUMN "pricing_base_price" numeric;
  ALTER TABLE "hostel_bookings" ADD COLUMN "pricing_seasonal_multiplier" numeric;
  ALTER TABLE "hostel_bookings" ADD COLUMN "pricing_weekend_multiplier" numeric;
  ALTER TABLE "hostel_bookings" ADD COLUMN "pricing_coupon_discount" numeric;
  ALTER TABLE "hostel_bookings" ADD COLUMN "pricing_final_price" numeric NOT NULL;
  ALTER TABLE "hostel_bookings" ADD COLUMN "pricing_price_breakdown" varchar;
  ALTER TABLE "hostel_bookings" DROP COLUMN "price";`)
}
