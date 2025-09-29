import { asc, eq, isNull, or } from "drizzle-orm";
import { cache } from "react";
import { okei } from "@/lib/db/schema/okei";
import { db } from "./index";
import { okpd2 } from "./schema/okpd2";

export const fetchOKPD2Roots = cache(async () => {
  return db
    .select()
    .from(okpd2)
    .where(isNull(okpd2.parentCode))
    .orderBy(asc(okpd2.code));
});

export const fetchOKPD2ById = cache(async (id: number) => {
  const items = await db
    .select()
    .from(okpd2)
    .where(or(eq(okpd2.id, id), eq(okpd2.parentId, id)));

  const item = items.find((i) => i.id === id);

  if (!item) {
    throw new Error(`OKPD2 element with id ${id} not found`);
  }

  const children = items
    .filter((i) => i.parentId === id)
    .sort((a, b) =>
      (a.code ?? "").localeCompare(b.code ?? "", undefined, { numeric: true }),
    );

  return { ...item, children };
});

export const fetchAllOKEI = cache(async () => {
  return db.select().from(okei).orderBy(asc(okei.code));
});
