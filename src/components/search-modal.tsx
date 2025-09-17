"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { Dialog, DialogPopup, DialogTrigger } from "@/components/ui/dialog";
import { useOkd2Search } from "@/lib/hooks/use-okpd2-search";
import { highlightText } from "@/lib/utils";

export function SearchModal({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [debouncedQuery] = useDebounce(query, 300);

  const { data, isLoading } = useOkd2Search(debouncedQuery);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer rounded-full p-2 hover:bg-gray-100">
        {children}
      </DialogTrigger>
      <DialogPopup showCloseButton>
        <input
          ref={inputRef}
          name="query"
          className="w-full bg-transparent py-1 focus:outline-hidden"
          placeholder="Поиск..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {isLoading && query ? (
          <div className="p-2 text-gray-500">Загрузка...</div>
        ) : (
          <ul>
            {data?.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/okpd2/${item.id}`}
                  className="cursor-pointer border-b block border-gray-100 p-4 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                >
                  <span>[{highlightText(item.code, debouncedQuery)}]</span>{" "}
                  <span>{highlightText(item.name, debouncedQuery)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </DialogPopup>
    </Dialog>
  );
}
