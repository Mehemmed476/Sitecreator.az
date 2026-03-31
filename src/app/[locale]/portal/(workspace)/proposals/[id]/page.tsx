import { notFound } from "next/navigation";
import { ClientProposalView } from "@/components/portal/ClientProposalView";
import { requirePortalSession } from "@/lib/auth-guards";
import { getAdminProposalDetail, getClientProposalDetail } from "@/lib/client-portal";

export default async function ClientProposalPage({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru"; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await requirePortalSession(locale);
  const proposal =
    session.user.role === "admin"
      ? await getAdminProposalDetail(id)
      : await getClientProposalDetail(session.user.id, id);

  if (!proposal) {
    notFound();
  }

  return <ClientProposalView locale={locale} proposal={proposal} />;
}
