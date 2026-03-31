import { AdminSalesShell } from "@/components/admin/dashboard/AdminSalesShell";
import { ProjectsManager } from "@/components/admin/dashboard/ProjectsManager";
import { getAdminProjectSummary } from "@/lib/project-admin";

export default async function AdminSalesProjectsPage({
  params,
}: {
  params: Promise<{ locale: "az" | "en" | "ru" }>;
}) {
  const { locale } = await params;
  const summary = await getAdminProjectSummary();

  return (
    <AdminSalesShell
      title="Layihələr və təkliflər"
      description="Lead-dən yaranmış proposal və layihələri burada yenilə, qiymət breakdown-u və milestone-ları idarə et."
    >
      <ProjectsManager locale={locale} summary={summary} />
    </AdminSalesShell>
  );
}
