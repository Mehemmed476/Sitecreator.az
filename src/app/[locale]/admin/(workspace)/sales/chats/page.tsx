import { AdminSalesShell } from "@/components/admin/dashboard/AdminSalesShell";
import { ProjectChatWorkspace } from "@/components/chat/ProjectChatWorkspace";
import { requireAdminSession } from "@/lib/auth-guards";
import { getAdminProjectChatThreads } from "@/lib/project-chat-data";

export default async function AdminSalesChatsPage({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru" }>;
}) {
  const { locale } = await params;
  await requireAdminSession(locale);
  const threads = await getAdminProjectChatThreads();

  return (
    <AdminSalesShell
      title="Realtime layihə chat-ləri"
      description="Bütün layihə yazışmaları, foto və fayl paylaşımı buradan idarə olunur. Solda söhbətlər, sağda seçilən thread görünür."
    >
      <ProjectChatWorkspace
        locale={locale}
        threads={threads}
        viewerRole="admin"
        title="Layihə chat mərkəzi"
        description="Komanda və müştəri yazışmaları burada realtime görünür."
      />
    </AdminSalesShell>
  );
}
