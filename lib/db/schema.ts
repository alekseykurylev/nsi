import { type SQL, sql } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  integer,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

export const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const okpd2 = pgTable(
  "okpd2",
  {
    id: integer("id").primaryKey(),
    parentId: integer("parent_id"),
    code: text("code").notNull(),
    parentCode: text("parent_code"),
    name: text("name").notNull(),
    actual: boolean("actual").notNull(),

    name_search: tsvector("name_search")
      .notNull()
      .generatedAlwaysAs((): SQL => sql`to_tsvector('russian', ${okpd2.name})`),
  },
  (table) => [
    index("idx_okpd2_code").on(table.code),
    index("idx_okpd2_name_fts").using("gin", table.name_search),
  ],
);
