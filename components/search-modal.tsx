"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useOkd2Search } from "@/lib/hooks/use-okpd2-search";
import { highlightText } from "@/lib/utils";
import { Dialog, DialogPopup, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";

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
      <DialogPopup
        showCloseButton={false}
        className="rounded-none max-w-screen sm:max-w-screen h-dvh p-0 gap-0 grid-rows-[auto_1fr]"
      >
        <div className="p-4 flex items-center gap-4 border-b border-gray-200">
          <Input
            ref={inputRef}
            name="query"
            placeholder="Поиск..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="Close search"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {isLoading && query ? (
          <div className="p-2 text-gray-500">Загрузка...</div>
        ) : (
          <div className="overflow-auto">
            {data?.map((item) => (
              <Link
                key={item.id}
                href={`/okpd2/${item.id}`}
                className="cursor-pointer border-b block border-gray-100 p-4 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                <span>[{highlightText(item.code, debouncedQuery)}]</span>{" "}
                <span>{highlightText(item.name, debouncedQuery)}</span>
              </Link>
            ))}
          </div>
        )}
      </DialogPopup>
    </Dialog>
  );
}
