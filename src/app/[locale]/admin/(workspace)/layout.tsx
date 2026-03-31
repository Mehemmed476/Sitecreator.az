import { AdminWorkspaceShell } from "@/components/admin/dashboard/AdminWorkspaceShell";
import { requireAdminSession } from "@/lib/auth-guards";

export default async function AdminWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireAdminSession(locale);

  return <AdminWorkspaceShell locale={locale}>{children}</AdminWorkspaceShell>;
}
