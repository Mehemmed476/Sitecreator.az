import type { InsightRecord } from "@/lib/insight-types";
import { InsightCard } from "@/components/insights/InsightCard";

export function InsightsGrid({
  insights,
  locale,
}: {
  insights: InsightRecord[];
  locale: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {insights.map((insight, index) => (
        <InsightCard
          key={insight._id}
          insight={insight}
          locale={locale}
          priority={index < 2}
        />
      ))}
    </div>
  );
}

