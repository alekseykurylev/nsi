import { Menu, Search } from "lucide-react";
import type { ReactNode } from "react";
import { SearchModal } from "@/components/search-modal";

export function TopSidebar({ children }: { children: ReactNode }) {
  return (
    <header className="bg-background sticky top-0 z-50 w-full p-4 flex items-center gap-4 border-b border-gray-200">
      <button
        className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
        type="button"
      >
        <Menu size={20} />
      </button>
      <div className="flex-1">{children}</div>
      <SearchModal>
        <Search size={20} />
      </SearchModal>
    </header>
  );
}
