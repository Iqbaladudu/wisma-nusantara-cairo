import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  try {
    console.log('🔧 Recreating hostel_bookings_room_selection table...')

    // Drop the problematic table completely
    await db.execute(sql`
      DROP TABLE IF EXISTS "hostel_bookings_room_selection" CASCADE;
    `)

    // Recreate the table with correct structure
    await db.execute(sql`
      CREATE TABLE "hostel_bookings_room_selection" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" varchar PRIMARY KEY NOT NULL,
        "room_type" "enum_hostel_bookings_room_selection_room_type" NOT NULL,
        "number_of_rooms" numeric DEFAULT 1 NOT NULL,
        "extra_beds" numeric DEFAULT 0
      );
    `)

    // Add foreign key constraint
    await db.execute(sql`
      ALTER TABLE "hostel_bookings_room_selection"
      ADD CONSTRAINT "hostel_bookings_room_selection_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."hostel_bookings"("id")
      ON DELETE cascade ON UPDATE no action;
    `)

    // Add indexes
    await db.execute(sql`
      CREATE INDEX "hostel_bookings_room_selection_order_idx"
      ON "hostel_bookings_room_selection" USING btree ("_order");
    `)

    await db.execute(sql`
      CREATE INDEX "hostel_bookings_room_selection_parent_id_idx"
      ON "hostel_bookings_room_selection" USING btree ("_parent_id");
    `)

    console.log('✅ hostel_bookings_room_selection table recreated successfully')
  } catch (error) {
    console.error('❌ Error recreating table:', error)
    throw error
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  try {
    console.log('🔄 Reverting table recreation...')

    // Just drop the table - the previous migration will handle recreation if needed
    await db.execute(sql`
      DROP TABLE IF EXISTS "hostel_bookings_room_selection" CASCADE;
    `)

    console.log('✅ Table recreation reverted successfully')
  } catch (error) {
    console.error('❌ Error reverting table recreation:', error)
    throw error
  }
}
