import { Search } from "lucide-react";
import Link from "next/link";
import { TopSidebar } from "@/components/top-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TopSidebar>
        <div className="flex items-center justify-between gap-4">
          <div className="text-xl font-semibold">
            <Link href="/okpd2">ОКПД 2</Link>
          </div>
          <Link
            className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
            href="/okpd2/search"
          >
            <Search size={20} />
          </Link>
        </div>
      </TopSidebar>
      <div>{children}</div>
    </div>
  );
}
