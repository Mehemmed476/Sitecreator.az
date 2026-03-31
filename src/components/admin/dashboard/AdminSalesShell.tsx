"use client";

import { Link, usePathname } from "@/i18n/navigation";

const salesTabs = [
  {
    href: "/admin/sales/messages",
    label: "Lead-lər",
    description: "Müraciətlər, statuslar və portal çevrilməsi",
  },
  {
    href: "/admin/sales/projects",
    label: "Layihələr",
    description: "Proposal, project və milestone idarəsi",
  },
  {
    href: "/admin/sales/chats",
    label: "Chat",
    description: "Realtime yazışma, foto və fayl axını",
  },
];

export function AdminSalesShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <section className="admin-panel rounded-[24px] p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">CRM və satış</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[720px]">
            {salesTabs.map((tab) => {
              const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`rounded-[20px] border px-4 py-3 text-left transition-all ${
                    isActive
                      ? "border-primary/25 bg-primary/10"
                      : "border-border bg-white/5 hover:border-primary/20"
                  }`}
                >
                  <p className="text-sm font-semibold">{tab.label}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{tab.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {children}
    </div>
  );
}
