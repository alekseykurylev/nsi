import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const okei = pgTable("okei", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  code: varchar("code", { length: 10 }).notNull(), // "003"
  fullName: varchar("full_name", { length: 500 }).notNull(), // "Миллиметр"

  sectionCode: varchar("section_code", { length: 10 }),
  sectionName: varchar("section_name", { length: 500 }),

  groupId: integer("group_id"),
  groupName: varchar("group_name", { length: 500 }),

  localName: varchar("local_name", { length: 100 }),
  internationalName: varchar("international_name", { length: 100 }),

  localSymbol: varchar("local_symbol", { length: 50 }),
  internationalSymbol: varchar("international_symbol", { length: 50 }),

  trueNationalCode: varchar("true_national_code", { length: 50 }),

  actual: boolean("actual").default(true),
  isTemporaryForKTRU: boolean("is_temporary_for_ktru").default(false),
});
