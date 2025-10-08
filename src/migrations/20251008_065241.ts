import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_hostel_bookings_stay_duration_checkindate_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Brisbane', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  CREATE TYPE "public"."enum_hostel_bookings_stay_duration_checkoutdate_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Brisbane', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  CREATE TYPE "public"."enum_auditorium_bookings_event_details_eventdate_tz" AS ENUM('Pacific/Midway', 'Pacific/Niue', 'Pacific/Honolulu', 'Pacific/Rarotonga', 'America/Anchorage', 'Pacific/Gambier', 'America/Los_Angeles', 'America/Tijuana', 'America/Denver', 'America/Phoenix', 'America/Chicago', 'America/Guatemala', 'America/New_York', 'America/Bogota', 'America/Caracas', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo', 'Atlantic/South_Georgia', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Europe/London', 'Europe/Berlin', 'Africa/Lagos', 'Europe/Athens', 'Africa/Cairo', 'Europe/Moscow', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Baku', 'Asia/Karachi', 'Asia/Tashkent', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Almaty', 'Asia/Jakarta', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Australia/Brisbane', 'Australia/Sydney', 'Pacific/Guam', 'Pacific/Noumea', 'Pacific/Auckland', 'Pacific/Fiji');
  CREATE TYPE "public"."enum_auditorium_bookings_exclude_services_air_conditioner" AS ENUM('none', '4-6_hours', '7-9_hours', '10-12_hours', '13-14_hours');
  CREATE TYPE "public"."enum_auditorium_bookings_exclude_services_extra_chairs" AS ENUM('none', '3_chairs', '5_chairs', '7_chairs', '10_chairs', '15_chairs', '20_chairs', '30_chairs', '40_chairs');
  CREATE TYPE "public"."enum_auditorium_bookings_exclude_services_projector" AS ENUM('none', 'projector_only', 'screen_only', 'projector_and_screen');
  CREATE TYPE "public"."enum_auditorium_bookings_exclude_services_extra_tables" AS ENUM('none', '3_tables', '6_tables', '9_tables', 'more_than_9');
  CREATE TYPE "public"."enum_auditorium_bookings_exclude_services_plates" AS ENUM('none', '6_plates', '12_plates', '18_plates', '24_plates');
  CREATE TYPE "public"."enum_auditorium_bookings_exclude_services_glasses" AS ENUM('none', '3_glasses', '6_glasses', '12_glasses');
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"whatsapp_send_confirmation" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "hostel_bookings" ADD COLUMN "stay_duration_checkindate_tz" "enum_hostel_bookings_stay_duration_checkindate_tz" DEFAULT 'Africa/Cairo' NOT NULL;
  ALTER TABLE "hostel_bookings" ADD COLUMN "stay_duration_checkoutdate_tz" "enum_hostel_bookings_stay_duration_checkoutdate_tz" DEFAULT 'Africa/Cairo' NOT NULL;
  ALTER TABLE "hostel_bookings" ADD COLUMN "accept_terms" boolean DEFAULT false NOT NULL;
  ALTER TABLE "auditorium_bookings" ADD COLUMN "event_details_eventdate_tz" "enum_auditorium_bookings_event_details_eventdate_tz" DEFAULT 'Africa/Cairo' NOT NULL;
  ALTER TABLE "auditorium_bookings" ADD COLUMN "event_details_event_end_time" varchar NOT NULL;
  ALTER TABLE "auditorium_bookings" ADD COLUMN "exclude_services_air_conditioner" "enum_auditorium_bookings_exclude_services_air_conditioner" DEFAULT 'none';
  ALTER TABLE "auditorium_bookings" ADD COLUMN "exclude_services_extra_chairs" "enum_auditorium_bookings_exclude_services_extra_chairs" DEFAULT 'none';
  ALTER TABLE "auditorium_bookings" ADD COLUMN "exclude_services_projector" "enum_auditorium_bookings_exclude_services_projector" DEFAULT 'none';
  ALTER TABLE "auditorium_bookings" ADD COLUMN "exclude_services_extra_tables" "enum_auditorium_bookings_exclude_services_extra_tables" DEFAULT 'none';
  ALTER TABLE "auditorium_bookings" ADD COLUMN "exclude_services_plates" "enum_auditorium_bookings_exclude_services_plates" DEFAULT 'none';
  ALTER TABLE "auditorium_bookings" ADD COLUMN "exclude_services_glasses" "enum_auditorium_bookings_exclude_services_glasses" DEFAULT 'none';
  ALTER TABLE "auditorium_bookings" ADD COLUMN "pricing_exclude_services_price" numeric;
  ALTER TABLE "auditorium_bookings" ADD COLUMN "pricing_exclude_services_breakdown" varchar;
  ALTER TABLE "auditorium_bookings" ADD COLUMN "accept_terms" boolean DEFAULT false NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "settings" CASCADE;
  ALTER TABLE "hostel_bookings" DROP COLUMN "stay_duration_checkindate_tz";
  ALTER TABLE "hostel_bookings" DROP COLUMN "stay_duration_checkoutdate_tz";
  ALTER TABLE "hostel_bookings" DROP COLUMN "accept_terms";
  ALTER TABLE "auditorium_bookings" DROP COLUMN "event_details_eventdate_tz";
  ALTER TABLE "auditorium_bookings" DROP COLUMN "event_details_event_end_time";
  ALTER TABLE "auditorium_bookings" DROP COLUMN "exclude_services_air_conditioner";
  ALTER TABLE "auditorium_bookings" DROP COLUMN "exclude_services_extra_chairs";
  ALTER TABLE "auditorium_bookings" DROP COLUMN "exclude_services_projector";
  ALTER TABLE "auditorium_bookings" DROP COLUMN "exclude_services_extra_tables";
  ALTER TABLE "auditorium_bookings" DROP COLUMN "exclude_services_plates";
  ALTER TABLE "auditorium_bookings" DROP COLUMN "exclude_services_glasses";
  ALTER TABLE "auditorium_bookings" DROP COLUMN "pricing_exclude_services_price";
  ALTER TABLE "auditorium_bookings" DROP COLUMN "pricing_exclude_services_breakdown";
  ALTER TABLE "auditorium_bookings" DROP COLUMN "accept_terms";
  DROP TYPE "public"."enum_hostel_bookings_stay_duration_checkindate_tz";
  DROP TYPE "public"."enum_hostel_bookings_stay_duration_checkoutdate_tz";
  DROP TYPE "public"."enum_auditorium_bookings_event_details_eventdate_tz";
  DROP TYPE "public"."enum_auditorium_bookings_exclude_services_air_conditioner";
  DROP TYPE "public"."enum_auditorium_bookings_exclude_services_extra_chairs";
  DROP TYPE "public"."enum_auditorium_bookings_exclude_services_projector";
  DROP TYPE "public"."enum_auditorium_bookings_exclude_services_extra_tables";
  DROP TYPE "public"."enum_auditorium_bookings_exclude_services_plates";
  DROP TYPE "public"."enum_auditorium_bookings_exclude_services_glasses";`)
}
