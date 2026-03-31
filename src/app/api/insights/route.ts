import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth-guards";
import { connectDB } from "@/lib/db";
import {
  generateUniqueInsightSlug,
  serializeInsight,
  validatePublishedInsightTranslations,
} from "@/lib/insights";
import {
  insightLocales,
  type InsightLocale,
  type InsightTranslations,
  type InsightType,
} from "@/lib/insight-types";
import { createEmptyInsightTranslations, normalizeInsightTags } from "@/lib/insight-utils";
import { Insight } from "@/lib/models/Insight";

export const runtime = "nodejs";

function parseBoolean(value: FormDataEntryValue | unknown) {
  return value === "true" || value === true || value === "on" || value === "1";
}

function parseInsightType(value: FormDataEntryValue | unknown): InsightType {
  return value === "case-study" ? "case-study" : "blog";
}

function parseCoverImageLocale(value: FormDataEntryValue | unknown): InsightLocale {
  return insightLocales.includes(value as InsightLocale) ? (value as InsightLocale) : "az";
}

function parsePublishedAt(value: FormDataEntryValue | unknown, published: boolean) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    return published ? new Date() : undefined;
  }

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? (published ? new Date() : undefined) : parsed;
}

function parseTranslationsInput(raw: unknown): InsightTranslations {
  const source =
    typeof raw === "string"
      ? (JSON.parse(raw || "{}") as Record<string, unknown>)
      : typeof raw === "object" && raw
        ? (raw as Record<string, unknown>)
        : {};
  const translations = createEmptyInsightTranslations();

  for (const locale of insightLocales) {
    const localeSource = (source[locale] as Record<string, unknown> | undefined) ?? {};
    translations[locale] = {
      title: String(localeSource.title ?? "").trim(),
      slug: String(localeSource.slug ?? "").trim(),
      excerpt: String(localeSource.excerpt ?? "").trim(),
      content: String(localeSource.content ?? "").trim(),
      tags: normalizeInsightTags(
        Array.isArray(localeSource.tags)
          ? localeSource.tags.map((item) => String(item))
          : String(localeSource.tags ?? "")
      ),
      coverImageUrl: String(localeSource.coverImageUrl ?? "").trim(),
      coverImagePublicId: String(localeSource.coverImagePublicId ?? "").trim(),
      seoTitle: String(localeSource.seoTitle ?? "").trim(),
      seoDescription: String(localeSource.seoDescription ?? "").trim(),
    };
  }

  return translations;
}

async function readInsightPayload(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const translations = parseTranslationsInput(String(formData.get("translations") ?? "{}"));
    const published = parseBoolean(formData.get("published"));
    const legacyCoverImageLocale = parseCoverImageLocale(formData.get("coverImageLocale"));
    const { saveInsightImage } = await import("@/lib/insight-images");
    const uploadedImages = await Promise.all(
      insightLocales.map(async (locale) => {
        const legacyImage =
          legacyCoverImageLocale === locale ? formData.get("coverImage") : null;
        const image = formData.get(`coverImage_${locale}`) ?? legacyImage;

        if (!(image instanceof File) || image.size <= 0) {
          return null;
        }

        return {
          locale,
          image: await saveInsightImage(image),
        };
      })
    );

    for (const uploaded of uploadedImages) {
      if (!uploaded) {
        continue;
      }

      translations[uploaded.locale] = {
        ...translations[uploaded.locale],
        coverImageUrl: uploaded.image.url,
        coverImagePublicId: uploaded.image.publicId,
      };
    }

    return {
      type: parseInsightType(formData.get("type")),
      translations,
      published,
      featured: parseBoolean(formData.get("featured")),
      publishedAt: parsePublishedAt(formData.get("publishedAt"), published),
    };
  }

  const body = await request.json();
  const published = parseBoolean(body?.published);
  const coverImageLocale = parseCoverImageLocale(body?.coverImageLocale);
  const translations = parseTranslationsInput(body?.translations);
  const coverImageUrl = String(body?.coverImageUrl ?? "").trim();
  const coverImagePublicId = String(body?.coverImagePublicId ?? "").trim();

  if (coverImageUrl || coverImagePublicId) {
    translations[coverImageLocale] = {
      ...translations[coverImageLocale],
      coverImageUrl,
      coverImagePublicId,
    };
  }

  return {
    type: parseInsightType(body?.type),
    translations,
    published,
    featured: parseBoolean(body?.featured),
    publishedAt: parsePublishedAt(body?.publishedAt, published),
  };
}

async function prepareTranslations(
  translations: InsightTranslations,
  excludeId?: string
) {
  for (const locale of insightLocales) {
    const translation = translations[locale];
    const slugSource =
      translation.slug || translation.title || translations.az.title || translations.az.slug;

    if (!slugSource) {
      continue;
    }

    translation.slug = await generateUniqueInsightSlug(
      slugSource,
      locale as InsightLocale,
      excludeId
    );
  }

  return translations;
}

export async function GET() {
  try {
    const session = await auth();
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const items = await Insight.find().sort({ featured: -1, publishedAt: -1, createdAt: -1 }).lean();
    return NextResponse.json(items.map(serializeInsight));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch insights." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const payload = await readInsightPayload(request);
    const hasAnyLocaleContent = insightLocales.some((locale) => {
      const translation = payload.translations[locale];
      return translation.title || translation.excerpt || translation.content;
    });

    if (!hasAnyLocaleContent) {
      return NextResponse.json({ error: "At least one locale must have content." }, { status: 400 });
    }

    const incompleteLocales = validatePublishedInsightTranslations(payload.translations);
    if (payload.published && incompleteLocales.length > 0) {
      return NextResponse.json(
        {
          error: `Complete all locales before publishing: ${incompleteLocales.join(", ").toUpperCase()}.`,
        },
        { status: 400 }
      );
    }

    const item = await Insight.create({
      ...payload,
      translations: await prepareTranslations(payload.translations),
      publishedAt: payload.published ? payload.publishedAt ?? new Date() : undefined,
    });

    return NextResponse.json(serializeInsight(item), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create insight." },
      { status: 500 }
    );
  }
}
