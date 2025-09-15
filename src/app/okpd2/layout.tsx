import type { Metadata } from "next";
import Link from "next/link";
import { TopSidebar } from "@/components/top-sidebar";

export const metadata: Metadata = {
  title: "Классификатор ОКПД 2",
  description:
    "ОКПД — Общероссийский классификатор продукции по видам экономической деятельности.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grow overflow-hidden">
      <TopSidebar>
        <div className="flex items-center justify-between gap-4">
          <div className="text-xl font-semibold">
            <Link href="/okpd2">ОКПД 2</Link>
          </div>
        </div>
      </TopSidebar>
      <div className="h-[calc(100vh-64px)] overflow-auto">{children}</div>
    </div>
  );
}
