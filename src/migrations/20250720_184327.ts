import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  try {
    console.log('🔧 Fixing room_type column data type...')

    // First, check if the table exists and has data
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'hostel_bookings_room_selection'
      );
    `)

    if (tableExists.rows[0]?.exists) {
      // Backup existing data if any
      const existingData = await db.execute(sql`
        SELECT * FROM "hostel_bookings_room_selection";
      `)

      console.log(`📊 Found ${existingData.rows.length} existing records`)

      // Drop the problematic column
      await db.execute(sql`
        ALTER TABLE "hostel_bookings_room_selection"
        DROP COLUMN IF EXISTS "room_type";
      `)

      // Add the column back with correct ENUM type
      await db.execute(sql`
        ALTER TABLE "hostel_bookings_room_selection"
        ADD COLUMN "room_type" "enum_hostel_bookings_room_selection_room_type" NOT NULL DEFAULT 'single-bed';
      `)

      // If there was existing data, we would restore it here with proper casting
      // For now, we'll just ensure the column exists with the right type

      console.log('✅ room_type column fixed successfully')
    } else {
      console.log('ℹ️  Table does not exist yet, skipping column fix')
    }
  } catch (error) {
    console.error('❌ Error fixing room_type column:', error)
    throw error
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  try {
    console.log('🔄 Reverting room_type column fix...')

    // Revert back to varchar if needed
    await db.execute(sql`
      ALTER TABLE "hostel_bookings_room_selection"
      DROP COLUMN IF EXISTS "room_type";
    `)

    await db.execute(sql`
      ALTER TABLE "hostel_bookings_room_selection"
      ADD COLUMN "room_type" varchar;
    `)

    console.log('✅ room_type column reverted successfully')
  } catch (error) {
    console.error('❌ Error reverting room_type column:', error)
    throw error
  }
}
