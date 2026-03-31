import { AdminAnalytics } from "@/components/admin/dashboard/AdminAnalytics";
import { getAnalyticsSummary } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const summary = await getAnalyticsSummary();

  return <AdminAnalytics summary={summary} />;
}
