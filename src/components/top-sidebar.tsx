import { Menu, Search } from "lucide-react";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TopSidebar({ children }: { children: ReactNode }) {
  return (
    <div className="p-4 flex items-center gap-4 border-b border-gray-200">
      <button
        className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
        type="button"
      >
        <Menu size={20} />
      </button>
      <div className="flex-1">{children}</div>
      <Dialog>
        <DialogTrigger className="cursor-pointer rounded-full p-2 hover:bg-gray-100">
          <Search size={20} />
        </DialogTrigger>
        <DialogContent showCloseButton>
          <DialogTitle>DialogTitle</DialogTitle>
          <DialogDescription>DialogDescription</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
