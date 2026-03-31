"use client";

import { signOut } from "next-auth/react";
import type { ReactNode } from "react";
import { ArrowUpRight, LogOut, MessagesSquare } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";

const portalNav = [
  { href: "/portal", label: "Panel" },
  { href: "/portal/chat", label: "Chat" },
];

export function ClientPortalShell({
  locale,
  clientName,
  children,
}: {
  locale: string;
  clientName: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="site-card sticky top-4 hidden h-[calc(100vh-2rem)] w-[280px] flex-col rounded-[28px] p-5 lg:flex">
          <div className="border-b border-border pb-4">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Client portal</p>
            <h2 className="mt-3 text-xl font-semibold">{clientName}</h2>
            <p className="mt-1 text-sm text-muted">Təkliflər, layihələr və canlı yazışmalar</p>
          </div>

          <nav className="mt-5 space-y-2">
            {portalNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition-colors ${
                    isActive ? "bg-primary/12 text-primary" : "text-muted hover:bg-surface"
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-[22px] border border-primary/15 bg-primary/6 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <MessagesSquare className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Realtime chat aktivdir</p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Komanda ilə bütün sual və fayl paylaşımını portal içindən edin.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-2 border-t border-border pt-4">
            <Link
              href="/"
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-muted hover:bg-surface"
            >
              <span>Sayta bax</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-muted hover:bg-surface"
            >
              <span className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Çıxış et
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
