import { X } from "lucide-react";
import { Suspense } from "react";
import { BackLink } from "@/components/back-link";
import { Search } from "@/components/search";
import { SearchList } from "@/components/search-list";
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
          <div className="w-full">
            <Suspense fallback="loading...">
              <Search />
            </Suspense>
          </div>
          <BackLink className="cursor-pointer rounded-full p-2 hover:bg-gray-100">
            <X size={20} />
          </BackLink>
        </div>
      </TopSidebar>
      <Suspense fallback="loading...">
        <SearchList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
