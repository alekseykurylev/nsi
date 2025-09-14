CREATE TABLE "okpd2" (
	"id" integer PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"code" text NOT NULL,
	"parent_code" text,
	"name" text NOT NULL,
	"actual" boolean NOT NULL
);
