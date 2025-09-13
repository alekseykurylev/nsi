import { cache } from "react";
import prisma from "@/lib/prisma";

export const fetchOKPD2Roots = cache(async () => {
  return prisma.okpd2.findMany({
    where: {
      parentCode: null,
    },
    orderBy: { code: "asc" },
  });
});

export const fetchOKPD2ById = cache(async (id: number) => {
  const items = await prisma.okpd2.findMany({
    where: {
      OR: [{ id }, { parentId: id }],
    },
  });

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

export const searchOKPD2 = cache(async (query: string, limit = 10) => {
  if (!query.trim()) {
    return [];
  }

  return prisma.okpd2.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { code: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { code: "asc" },
    take: limit,
  });
});
