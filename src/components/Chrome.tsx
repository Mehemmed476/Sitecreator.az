"use client";

import { type ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideChrome = /(^|\/)(admin|portal)(\/|$)/.test(pathname);

  return (
    <>
      {!hideChrome && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideChrome && <Footer />}
    </>
  );
}
