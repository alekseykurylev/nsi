"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function BackLink({
  className,
  children,
}: {
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();
  return (
    <button className={className} type="button" onClick={() => router.back()}>
      {children}
    </button>
  );
}
