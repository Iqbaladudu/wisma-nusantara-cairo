import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_hostel_bookings_airport_pickup" AS ENUM('none', 'medium_vehicle', 'hiace');
  CREATE TYPE "public"."enum_hostel_bookings_meal_options_breakfast_option" AS ENUM('none', 'nasi_goreng', 'ayam_goreng', 'nasi_kuning');
  CREATE TYPE "public"."enum_hostel_bookings_meal_options_breakfast_frequency" AS ENUM('checkin_only', 'during_stay', 'checkout_only');
  CREATE TYPE "public"."enum_hostel_bookings_meal_options_lunch_option" AS ENUM('none', 'nasi_goreng', 'ayam_goreng', 'nasi_kuning');
  CREATE TYPE "public"."enum_hostel_bookings_meal_options_lunch_frequency" AS ENUM('checkin_only', 'during_stay', 'checkout_only');
  CREATE TYPE "public"."enum_hostel_bookings_meal_options_dinner_option" AS ENUM('none', 'nasi_goreng', 'ayam_goreng', 'nasi_kuning');
  CREATE TYPE "public"."enum_hostel_bookings_meal_options_dinner_frequency" AS ENUM('checkin_only', 'during_stay', 'checkout_only');
  CREATE TYPE "public"."enum_auditorium_bookings_payment_status" AS ENUM('PAID', 'INVOICED');
  CREATE TABLE "auditorium_bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"country_of_origin" varchar NOT NULL,
  	"event_details_event_name" varchar NOT NULL,
  	"event_details_event_date" timestamp(3) with time zone NOT NULL,
  	"event_details_event_time" varchar NOT NULL,
  	"contact_info_egypt_phone_number" varchar NOT NULL,
  	"contact_info_whatsapp_number" varchar NOT NULL,
  	"coupon_code" varchar,
  	"pricing_base_price" numeric,
  	"pricing_seasonal_multiplier" numeric,
  	"pricing_weekend_multiplier" numeric,
  	"pricing_coupon_discount" numeric,
  	"pricing_final_price" numeric NOT NULL,
  	"pricing_price_breakdown" varchar,
  	"payment_status" "enum_auditorium_bookings_payment_status" DEFAULT 'INVOICED' NOT NULL,
  	"event_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "hall_bookings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "hall_bookings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_hall_bookings_fk";
  
  DROP INDEX "payload_locked_documents_rels_hall_bookings_id_idx";
  ALTER TABLE "hostel_bookings" ADD COLUMN "airport_pickup" "enum_hostel_bookings_airport_pickup" DEFAULT 'none';
  ALTER TABLE "hostel_bookings" ADD COLUMN "departure_date_time_departure_date" timestamp(3) with time zone;
  ALTER TABLE "hostel_bookings" ADD COLUMN "departure_date_time_departure_time" varchar;
  ALTER TABLE "hostel_bookings" ADD COLUMN "meal_options_breakfast_option" "enum_hostel_bookings_meal_options_breakfast_option" DEFAULT 'none';
  ALTER TABLE "hostel_bookings" ADD COLUMN "meal_options_breakfast_portions" numeric;
  ALTER TABLE "hostel_bookings" ADD COLUMN "meal_options_breakfast_frequency" "enum_hostel_bookings_meal_options_breakfast_frequency";
  ALTER TABLE "hostel_bookings" ADD COLUMN "meal_options_lunch_option" "enum_hostel_bookings_meal_options_lunch_option" DEFAULT 'none';
  ALTER TABLE "hostel_bookings" ADD COLUMN "meal_options_lunch_portions" numeric;
  ALTER TABLE "hostel_bookings" ADD COLUMN "meal_options_lunch_frequency" "enum_hostel_bookings_meal_options_lunch_frequency";
  ALTER TABLE "hostel_bookings" ADD COLUMN "meal_options_dinner_option" "enum_hostel_bookings_meal_options_dinner_option" DEFAULT 'none';
  ALTER TABLE "hostel_bookings" ADD COLUMN "meal_options_dinner_portions" numeric;
  ALTER TABLE "hostel_bookings" ADD COLUMN "meal_options_dinner_frequency" "enum_hostel_bookings_meal_options_dinner_frequency";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "auditorium_bookings_id" integer;
  CREATE INDEX "auditorium_bookings_updated_at_idx" ON "auditorium_bookings" USING btree ("updated_at");
  CREATE INDEX "auditorium_bookings_created_at_idx" ON "auditorium_bookings" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_auditorium_bookings_fk" FOREIGN KEY ("auditorium_bookings_id") REFERENCES "public"."auditorium_bookings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_auditorium_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("auditorium_bookings_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "hall_bookings_id";
  DROP TYPE "public"."enum_hall_bookings_payment_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_hall_bookings_payment_status" AS ENUM('PAID', 'INVOICED');
  CREATE TABLE "hall_bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"country_of_origin" varchar NOT NULL,
  	"event_details_event_name" varchar NOT NULL,
  	"event_details_event_date" timestamp(3) with time zone NOT NULL,
  	"event_details_event_time" varchar NOT NULL,
  	"contact_info_egypt_phone_number" varchar NOT NULL,
  	"contact_info_whatsapp_number" varchar NOT NULL,
  	"coupon_code" varchar,
  	"pricing_base_price" numeric,
  	"pricing_seasonal_multiplier" numeric,
  	"pricing_weekend_multiplier" numeric,
  	"pricing_coupon_discount" numeric,
  	"pricing_final_price" numeric NOT NULL,
  	"pricing_price_breakdown" varchar,
  	"payment_status" "enum_hall_bookings_payment_status" DEFAULT 'INVOICED' NOT NULL,
  	"event_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "auditorium_bookings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "auditorium_bookings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_auditorium_bookings_fk";
  
  DROP INDEX "payload_locked_documents_rels_auditorium_bookings_id_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "hall_bookings_id" integer;
  CREATE INDEX "hall_bookings_updated_at_idx" ON "hall_bookings" USING btree ("updated_at");
  CREATE INDEX "hall_bookings_created_at_idx" ON "hall_bookings" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hall_bookings_fk" FOREIGN KEY ("hall_bookings_id") REFERENCES "public"."hall_bookings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_hall_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("hall_bookings_id");
  ALTER TABLE "hostel_bookings" DROP COLUMN "airport_pickup";
  ALTER TABLE "hostel_bookings" DROP COLUMN "departure_date_time_departure_date";
  ALTER TABLE "hostel_bookings" DROP COLUMN "departure_date_time_departure_time";
  ALTER TABLE "hostel_bookings" DROP COLUMN "meal_options_breakfast_option";
  ALTER TABLE "hostel_bookings" DROP COLUMN "meal_options_breakfast_portions";
  ALTER TABLE "hostel_bookings" DROP COLUMN "meal_options_breakfast_frequency";
  ALTER TABLE "hostel_bookings" DROP COLUMN "meal_options_lunch_option";
  ALTER TABLE "hostel_bookings" DROP COLUMN "meal_options_lunch_portions";
  ALTER TABLE "hostel_bookings" DROP COLUMN "meal_options_lunch_frequency";
  ALTER TABLE "hostel_bookings" DROP COLUMN "meal_options_dinner_option";
  ALTER TABLE "hostel_bookings" DROP COLUMN "meal_options_dinner_portions";
  ALTER TABLE "hostel_bookings" DROP COLUMN "meal_options_dinner_frequency";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "auditorium_bookings_id";
  DROP TYPE "public"."enum_hostel_bookings_airport_pickup";
  DROP TYPE "public"."enum_hostel_bookings_meal_options_breakfast_option";
  DROP TYPE "public"."enum_hostel_bookings_meal_options_breakfast_frequency";
  DROP TYPE "public"."enum_hostel_bookings_meal_options_lunch_option";
  DROP TYPE "public"."enum_hostel_bookings_meal_options_lunch_frequency";
  DROP TYPE "public"."enum_hostel_bookings_meal_options_dinner_option";
  DROP TYPE "public"."enum_hostel_bookings_meal_options_dinner_frequency";
  DROP TYPE "public"."enum_auditorium_bookings_payment_status";`)
}
