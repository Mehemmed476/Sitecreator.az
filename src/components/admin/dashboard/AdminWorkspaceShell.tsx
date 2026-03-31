"use client";

import { createElement, useMemo, useState, type ReactNode } from "react";
import { signOut } from "next-auth/react";
import { ArrowUpRight, Code2, LogOut, Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import {
  adminTabs,
  getAdminTabConfig,
  getAdminTabFromPathname,
} from "@/components/admin/dashboard/navigation";

export function AdminWorkspaceShell({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeTab = useMemo(() => getAdminTabFromPathname(pathname), [pathname]);
  const activeConfig = useMemo(() => getAdminTabConfig(activeTab), [activeTab]);
  const groupedTabs = useMemo(
    () => ({
      Panel: adminTabs.filter((item) => item.group === "Panel"),
      Məzmun: adminTabs.filter((item) => item.group === "Məzmun"),
      Böyümə: adminTabs.filter((item) => item.group === "Böyümə"),
      Əməliyyatlar: adminTabs.filter((item) => item.group === "Əməliyyatlar"),
    }),
    []
  );

  return (
    <div className="admin-shell min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <div
          className={`fixed inset-0 z-40 bg-black/55 backdrop-blur-sm transition-opacity lg:hidden ${
            mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <aside
          className={`admin-sidebar fixed inset-y-4 left-4 z-50 flex w-[300px] max-w-[calc(100vw-2rem)] flex-col rounded-[28px] p-4 transition-transform duration-300 lg:sticky lg:top-4 lg:z-0 lg:h-[calc(100vh-2rem)] lg:w-[290px] lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-[120%]"
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
            <Link
              href="/admin"
              className="flex items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="admin-brand-mark flex h-10 w-10 items-center justify-center rounded-xl text-white">
                <Code2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-base font-semibold">
                  Site<span className="text-primary">creator</span>
                </p>
                <p className="text-xs text-muted">İdarə paneli</p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="site-control flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
              aria-label="Admin menyunu bağla"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
            {(Object.entries(groupedTabs) as Array<[keyof typeof groupedTabs, typeof adminTabs]>).map(
              ([groupName, items]) =>
                items.length ? (
                  <div key={groupName}>
                    <p className="px-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {groupName}
                    </p>
                    <div className="mt-2 space-y-2">
                      {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`admin-nav-item flex items-start gap-3 rounded-[18px] px-3.5 py-3 transition-all ${
                              isActive ? "admin-nav-item-active" : ""
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                isActive
                                  ? "bg-primary/15 text-primary"
                                  : "bg-surface text-muted"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </span>

                            <span className="min-w-0">
                              <span className="block text-sm font-semibold">{item.label}</span>
                              <span
                                className={`mt-1 block text-xs leading-5 ${
                                  isActive ? "text-muted" : "text-muted-foreground"
                                }`}
                              >
                                {item.description}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : null
            )}
          </nav>

          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <Link
              href="/"
              className="admin-sidebar-link flex items-center justify-between rounded-[16px] px-3.5 py-3 text-sm font-medium"
            >
              <span>Sayta bax</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="admin-sidebar-link flex w-full cursor-pointer items-center justify-between rounded-[16px] px-3.5 py-3 text-sm font-medium text-muted transition-all duration-200 hover:border-red-500/30 hover:text-red-300"
            >
              <span className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Çıxış et
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 lg:pl-0">
          <header className="admin-topbar sticky top-4 z-30 mb-4 flex items-center justify-between rounded-[18px] px-4 py-3 lg:hidden">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="site-control flex h-10 w-10 items-center justify-center rounded-full"
                aria-label="Admin menyunu aç"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {createElement(activeConfig.icon, { className: "h-4 w-4" })}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{activeConfig.label}</p>
                <p className="truncate text-xs text-muted">{activeConfig.description}</p>
              </div>
            </div>
          </header>

          <div className="pb-10 pt-1 lg:pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
