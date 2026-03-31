import { BetaAnalyticsDataClient } from "@google-analytics/data";

export function getGaMeasurementId() {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-SM33FW1RRT";
}

function getGaPropertyId() {
  return process.env.GA4_PROPERTY_ID?.trim() || "";
}

function getGaClientEmail() {
  return process.env.GA4_CLIENT_EMAIL?.trim() || "";
}

function getGaPrivateKey() {
  return process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, "\n").trim() || "";
}

export function hasGaReportingConfig() {
  return Boolean(getGaPropertyId() && getGaClientEmail() && getGaPrivateKey());
}

function createGaClient() {
  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: getGaClientEmail(),
      private_key: getGaPrivateKey(),
    },
  });
}

export interface AnalyticsSummaryMetric {
  label: string;
  value: string;
  note: string;
}

export interface AnalyticsSummary {
  measurementId: string;
  reportingReady: boolean;
  propertyId?: string;
  error?: string;
  rangeLabel: string;
  metrics: AnalyticsSummaryMetric[];
  topPages: Array<{ path: string; views: string }>;
  trafficSources: Array<{ source: string; sessions: string }>;
}

function metricValue(value?: string | null) {
  return value ? Number(value) : 0;
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function formatDuration(seconds: number) {
  if (!seconds) {
    return "0s";
  }

  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const measurementId = getGaMeasurementId();
  const propertyId = getGaPropertyId();

  if (!hasGaReportingConfig()) {
    return {
      measurementId,
      reportingReady: false,
      propertyId: propertyId || undefined,
      rangeLabel: "Son 30 gün",
      metrics: [],
      topPages: [],
      trafficSources: [],
      error:
        "GA4 Data API üçün GA4_PROPERTY_ID, GA4_CLIENT_EMAIL və GA4_PRIVATE_KEY env-ləri əlavə olunmalıdır.",
    };
  }

  try {
    const client = createGaClient();
    const property = `properties/${propertyId}`;

    const [summaryResponse] = await client.runReport({
      property,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
      ],
    });

    const [pagesResponse] = await client.runReport({
      property,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 6,
    });

    const [sourcesResponse] = await client.runReport({
      property,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 6,
    });

    const summaryRow = summaryResponse.rows?.[0];
    const activeUsers = metricValue(summaryRow?.metricValues?.[0]?.value);
    const sessions = metricValue(summaryRow?.metricValues?.[1]?.value);
    const pageViews = metricValue(summaryRow?.metricValues?.[2]?.value);
    const avgSession = metricValue(summaryRow?.metricValues?.[3]?.value);

    return {
      measurementId,
      propertyId,
      reportingReady: true,
      rangeLabel: "Son 30 gün",
      metrics: [
        {
          label: "Aktiv istifadəçilər",
          value: formatInteger(activeUsers),
          note: "Təkrarsız aktiv user sayı",
        },
        {
          label: "Sessiyalar",
          value: formatInteger(sessions),
          note: "Bütün ziyarət sessiyaları",
        },
        {
          label: "Səhifə baxışları",
          value: formatInteger(pageViews),
          note: "Ümumi page view sayı",
        },
        {
          label: "Orta sessiya",
          value: formatDuration(avgSession),
          note: "Average session duration",
        },
      ],
      topPages:
        pagesResponse.rows?.map((row) => ({
          path: row.dimensionValues?.[0]?.value || "/",
          views: formatInteger(metricValue(row.metricValues?.[0]?.value)),
        })) || [],
      trafficSources:
        sourcesResponse.rows?.map((row) => ({
          source: row.dimensionValues?.[0]?.value || "Unknown",
          sessions: formatInteger(metricValue(row.metricValues?.[0]?.value)),
        })) || [],
    };
  } catch (error) {
    return {
      measurementId,
      reportingReady: false,
      propertyId: propertyId || undefined,
      rangeLabel: "Son 30 gün",
      metrics: [],
      topPages: [],
      trafficSources: [],
      error: error instanceof Error ? error.message : "GA4 məlumatlarını oxumaq mümkün olmadı.",
    };
  }
}
