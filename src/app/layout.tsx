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
    <html lang="ru" className={`${inter.className} antialiased`}>
      <body>
        <div className="flex min-h-svh w-full">{children}</div>
      </body>
    </html>
  );
}
