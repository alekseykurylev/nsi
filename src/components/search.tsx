"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    console.log(pathname);
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <input
      className="border w-full"
      placeholder="Поиск..."
      onChange={(e) => {
        handleSearch(e.target.value);
      }}
    />
  );
}
