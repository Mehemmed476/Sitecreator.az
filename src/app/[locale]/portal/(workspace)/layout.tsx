import type { ReactNode } from "react";
import { ClientPortalShell } from "@/components/portal/ClientPortalShell";
import { requirePortalSession } from "@/lib/auth-guards";

export default async function ClientPortalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requirePortalSession(locale);

  return (
    <ClientPortalShell
      locale={locale}
      clientName={session.user.role === "admin" ? "Admin preview" : session.user.name || "Müştəri"}
    >
      {children}
    </ClientPortalShell>
  );
}
