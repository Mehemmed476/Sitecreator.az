import { notFound } from "next/navigation";
import { ClientProjectView } from "@/components/portal/ClientProjectView";
import { requirePortalSession } from "@/lib/auth-guards";
import { getAdminProjectDetail, getClientProjectDetail } from "@/lib/client-portal";

export default async function ClientProjectPage({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru"; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await requirePortalSession(locale);
  const project =
    session.user.role === "admin"
      ? await getAdminProjectDetail(id)
      : await getClientProjectDetail(session.user.id, id);

  if (!project) {
    notFound();
  }

  return <ClientProjectView locale={locale} project={project} />;
}
