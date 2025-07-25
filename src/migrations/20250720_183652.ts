import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  try {
    // Create ENUM types
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_hostel_bookings_room_selection_room_type" AS ENUM('single-bed', 'double-bed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_hostel_bookings_payment_status" AS ENUM('PAID', 'DOWNPAYMENT', 'INVOICED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_hall_bookings_payment_status" AS ENUM('PAID', 'INVOICED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_pricing_config_type" AS ENUM('hostel_per_person', 'hostel_per_room', 'hall_per_hour', 'hall_per_day', 'hall_per_event');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_coupons_applicable_services" AS ENUM('hostel', 'hall');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_coupons_usage_history_booking_type" AS ENUM('hostel', 'hall');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_coupons_type" AS ENUM('percentage', 'fixed', 'free_nights', 'free_hours');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    console.log('✅ ENUM types created successfully')
  } catch (error) {
    console.error('❌ Error creating ENUM types:', error)
    throw error
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  try {
    // Drop ENUM types in reverse order
    await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_coupons_type" CASCADE;`)
    await db.execute(
      sql`DROP TYPE IF EXISTS "public"."enum_coupons_usage_history_booking_type" CASCADE;`,
    )
    await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_coupons_applicable_services" CASCADE;`)
    await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_pricing_config_type" CASCADE;`)
    await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_hall_bookings_payment_status" CASCADE;`)
    await db.execute(
      sql`DROP TYPE IF EXISTS "public"."enum_hostel_bookings_payment_status" CASCADE;`,
    )
    await db.execute(
      sql`DROP TYPE IF EXISTS "public"."enum_hostel_bookings_room_selection_room_type" CASCADE;`,
    )

    console.log('✅ ENUM types dropped successfully')
  } catch (error) {
    console.error('❌ Error dropping ENUM types:', error)
    throw error
  }
}
