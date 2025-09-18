import { Menu, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SearchModal } from "@/components/search-modal";

export const metadata: Metadata = {
  title: "Классификатор ОКПД 2",
  description:
    "ОКПД — Общероссийский классификатор продукции по видам экономической деятельности.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex w-full flex-1 flex-col">
      <header className="sticky top-0 shrink-0 p-4 flex items-center gap-4 border-b bg-white border-gray-200">
        <button
          className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
          type="button"
        >
          <Menu size={20} />
        </button>
        <div className="flex-1 flex items-center justify-between gap-4 ">
          <Link href="/okpd2" className="text-xl font-semibold">
            ОКПД 2
          </Link>
        </div>
        <SearchModal>
          <Search size={20} />
        </SearchModal>
      </header>
      <main className="flex flex-1 flex-col ">{children}</main>
    </div>
  );
}
