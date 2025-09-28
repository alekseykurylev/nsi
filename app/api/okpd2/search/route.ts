import { ilike, or, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { okpd2 } from "@/lib/db/schema/okpd2";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query")?.trim() ?? "";
    const limit = Number(searchParams.get("limit") ?? "20");

    if (!query) {
      return NextResponse.json([]);
    }

    const results = await db
      .select()
      .from(okpd2)
      .where(
        or(
          sql`${okpd2.name_search} @@ websearch_to_tsquery('russian', ${query})`,
          ilike(okpd2.name, `%${query}%`),
          ilike(okpd2.code, `%${query}%`),
        ),
      )
      .limit(limit);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Ошибка при поиске в OKPD2:", error);
    return NextResponse.json(
      { error: "Ошибка при выполнении поиска" },
      { status: 500 },
    );
  }
}
