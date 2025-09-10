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
