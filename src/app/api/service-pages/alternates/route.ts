import { NextRequest, NextResponse } from "next/server";
import { getServicePageBySlug } from "@/lib/service-pages-store";
import { getServiceAlternates, type ServiceLocale } from "@/lib/service-pages";

export const runtime = "nodejs";

function parseLocale(value: string | null): ServiceLocale {
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

    const service = await getServicePageBySlug(slug, locale);

    if (!service) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({ alternates: getServiceAlternates(service) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to resolve alternates." },
      { status: 500 }
    );
  }
}
