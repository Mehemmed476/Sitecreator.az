import { NextRequest, NextResponse } from "next/server";
import { getPublishedInsightBySlug } from "@/lib/insights";
import { getInsightAlternates } from "@/lib/insight-utils";
import type { InsightLocale } from "@/lib/insight-types";

export const runtime = "nodejs";

function parseLocale(value: string | null): InsightLocale {
  return value === "en" || value === "ru" ? value : "az";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = String(searchParams.get("slug") ?? "").trim();
    const locale = parseLocale(searchParams.get("locale"));

    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    const insight = await getPublishedInsightBySlug(slug, locale);

    if (!insight) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({ alternates: getInsightAlternates(insight) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to resolve alternates." },
      { status: 500 }
    );
  }
}
