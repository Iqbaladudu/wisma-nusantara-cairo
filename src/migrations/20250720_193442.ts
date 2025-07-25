import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "hostel_bookings_room_selection" CASCADE;
  ALTER TABLE "hostel_bookings" ADD COLUMN "room_selection_single_bed" numeric DEFAULT 0 NOT NULL;
  ALTER TABLE "hostel_bookings" ADD COLUMN "room_selection_double_bed" numeric DEFAULT 0 NOT NULL;
  ALTER TABLE "hostel_bookings" ADD COLUMN "room_selection_extra_bed" numeric DEFAULT 0 NOT NULL;
  DROP TYPE "public"."enum_hostel_bookings_room_selection_room_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_hostel_bookings_room_selection_room_type" AS ENUM('single-bed', 'double-bed');
  CREATE TABLE "hostel_bookings_room_selection" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"room_type" "enum_hostel_bookings_room_selection_room_type" NOT NULL,
  	"number_of_rooms" numeric DEFAULT 1 NOT NULL,
  	"extra_beds" numeric DEFAULT 0
  );
  
  ALTER TABLE "hostel_bookings_room_selection" ADD CONSTRAINT "hostel_bookings_room_selection_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hostel_bookings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "hostel_bookings_room_selection_order_idx" ON "hostel_bookings_room_selection" USING btree ("_order");
  CREATE INDEX "hostel_bookings_room_selection_parent_id_idx" ON "hostel_bookings_room_selection" USING btree ("_parent_id");
  ALTER TABLE "hostel_bookings" DROP COLUMN "room_selection_single_bed";
  ALTER TABLE "hostel_bookings" DROP COLUMN "room_selection_double_bed";
  ALTER TABLE "hostel_bookings" DROP COLUMN "room_selection_extra_bed";`)
}
