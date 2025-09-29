import "./globals.css";

import { Menu } from "lucide-react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "Классификаторы",
  description: "Общероссийские классификаторы",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.className} antialiased`}>
      <body className="flex min-h-svh w-full">
        <div className="relative flex w-full flex-1 flex-col">
          <header className="sticky top-0 shrink-0 p-4 flex items-center gap-2 border-b bg-white border-gray-200">
            <button
              className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
              type="button"
            >
              <Menu size={20} />
            </button>
            <Link href="/" className="font-bold uppercase">
              Классификаторы
            </Link>
          </header>
          <div className="flex-1">{children}</div>
          <footer>footer</footer>
        </div>
      </body>
    </html>
  );
}
