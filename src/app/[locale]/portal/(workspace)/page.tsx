import { redirect } from "next/navigation";
import { ClientPortalOverview } from "@/components/portal/ClientPortalOverview";
import { requirePortalSession } from "@/lib/auth-guards";
import { getClientPortalOverview } from "@/lib/client-portal";

export default async function ClientPortalOverviewPage({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru" }>;
}) {
  const { locale } = await params;
  const session = await requirePortalSession(locale);

  if (session.user.role === "admin") {
    redirect(`/${locale}/admin/sales/projects`);
  }

  const data = await getClientPortalOverview(session.user.id);

  if (!data) {
    redirect(`/${locale}/portal/login`);
  }

  return <ClientPortalOverview locale={locale} data={data} />;
}
