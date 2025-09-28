import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./lib/db/migrations",
  schema: ["./lib/db/schema/okpd2.ts", "./lib/db/schema/okei.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
