import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/okpd2";

dotenv.config();

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});
export const db = drizzle(pool, { schema });
