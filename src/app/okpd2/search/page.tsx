import { X } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { Search } from "@/components/search";
import { TopSidebar } from "@/components/top-sidebar";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  return (
    <div>
      <TopSidebar>
        <div className="flex items-center gap-4">
          <Search />
          <BackLink className="cursor-pointer rounded-full p-2 hover:bg-gray-100">
            <X size={20} />
          </BackLink>
        </div>
      </TopSidebar>
      SearchPage
    </div>
  );
}
