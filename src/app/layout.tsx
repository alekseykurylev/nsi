import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "OKPD2",
  description: "Справочник ОКПД 2 (ОК 034-2014)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`bg-white text-gray-800 ${inter.className} antialiased`}
    >
      <body className="flex h-screen">
        <main className="grow overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
