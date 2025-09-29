import { Search } from "lucide-react";
import type { Metadata } from "next";
import { SearchModal } from "@/components/search-modal";

export const metadata: Metadata = {
  title: "Классификатор ОКПД 2",
  description:
    "ОКПД — Общероссийский классификатор продукции по видам экономической деятельности.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SearchModal>
        <Search size={20} />
      </SearchModal>
      <div>{children}</div>
    </div>
  );
}
