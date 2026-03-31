import { AdminOverview } from "@/components/admin/dashboard/AdminOverview";
import { getAdminDashboardSummary } from "@/lib/admin-dashboard";

export default async function AdminIndexPage() {
  const summary = await getAdminDashboardSummary();

  return <AdminOverview summary={summary} />;
}
