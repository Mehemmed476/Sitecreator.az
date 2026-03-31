import { redirect } from "next/navigation";
import { ProjectChatWorkspace } from "@/components/chat/ProjectChatWorkspace";
import { requirePortalSession } from "@/lib/auth-guards";
import { getClientProjectChatThreads } from "@/lib/project-chat-data";

export default async function ClientPortalChatPage({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru" }>;
}) {
  const { locale } = await params;
  const session = await requirePortalSession(locale);

  if (session.user.role === "admin") {
    redirect(`/${locale}/admin/sales/chats`);
  }

  const threads = await getClientProjectChatThreads(session.user.id);

  return (
    <ProjectChatWorkspace
      locale={locale}
      threads={threads}
      viewerRole="client"
      showThreadList={false}
      title="Layihə chatiniz"
      description="Komanda ilə bütün yazışmaları, foto və faylları bir pəncərədən idarə edin."
    />
  );
}
