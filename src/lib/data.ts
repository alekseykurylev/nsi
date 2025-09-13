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
  const item = await prisma.okpd2.findUnique({
    where: { id },
  });

  if (!item) {
    throw new Error(`OKPD2 element with code ${id} not found`);
  }

  return item;
});
