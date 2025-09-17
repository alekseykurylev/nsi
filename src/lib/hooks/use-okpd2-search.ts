import type { InferSelectModel } from "drizzle-orm";
import useSWR from "swr";
import type { okpd2 } from "@/lib/db/schema";
import { fetcher } from "@/lib/utils";

export type OKPD2 = InferSelectModel<typeof okpd2>;

export const useOkd2Search = (query: string, limit = 10) => {
  const { data, isLoading, error } = useSWR<OKPD2[]>(
    query.trim()
      ? `/api/okpd2/search?query=${encodeURIComponent(query)}&limit=${limit}`
      : null,
    fetcher,
  );

  return {
    data,
    isLoading,
    isError: Boolean(error),
    error,
  };
};
