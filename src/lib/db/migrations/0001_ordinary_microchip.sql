ALTER TABLE "okpd2" ADD COLUMN "name_search" "tsvector" GENERATED ALWAYS AS (to_tsvector('russian', "okpd2"."name")) STORED NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_okpd2_code" ON "okpd2" USING btree ("code");--> statement-breakpoint
CREATE INDEX "idx_okpd2_name_fts" ON "okpd2" USING gin ("name_search");