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

async function readInsightUpdatePayload(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const translations = parseTranslationsInput(String(formData.get("translations") ?? "{}"));
    const published = parseBoolean(formData.get("published"));
    const legacyCoverImageLocale = parseCoverImageLocale(formData.get("coverImageLocale"));
    const { saveInsightImage } = await import("@/lib/insight-images");
    const uploadedCoverImages = Object.fromEntries(
      insightLocales.map((locale) => [locale, null])
    ) as Record<InsightLocale, { url: string; publicId: string } | null>;
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
      uploadedCoverImages[uploaded.locale] = uploaded.image;
    }

    return {
      type: parseInsightType(formData.get("type")),
      translations,
      uploadedCoverImages,
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
  const uploadedCoverImages = Object.fromEntries(
    insightLocales.map((locale) => [locale, null])
  ) as Record<InsightLocale, { url: string; publicId: string } | null>;

  if (coverImageUrl || coverImagePublicId) {
    translations[coverImageLocale] = {
      ...translations[coverImageLocale],
      coverImageUrl,
      coverImagePublicId,
    };
    uploadedCoverImages[coverImageLocale] = {
      url: coverImageUrl,
      publicId: coverImagePublicId,
    };
  }

  return {
    type: parseInsightType(body?.type),
    translations,
    uploadedCoverImages,
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

function buildTranslationUpdate(translations: InsightTranslations) {
  const update: Record<string, string | string[]> = {};

  for (const locale of insightLocales) {
    const translation = translations[locale];
    update[`translations.${locale}.title`] = translation.title;
    update[`translations.${locale}.slug`] = translation.slug;
    update[`translations.${locale}.excerpt`] = translation.excerpt;
    update[`translations.${locale}.content`] = translation.content;
    update[`translations.${locale}.tags`] = translation.tags;
    update[`translations.${locale}.coverImageUrl`] = translation.coverImageUrl ?? "";
    update[`translations.${locale}.coverImagePublicId`] = translation.coverImagePublicId ?? "";
    update[`translations.${locale}.seoTitle`] = translation.seoTitle ?? "";
    update[`translations.${locale}.seoDescription`] = translation.seoDescription ?? "";
  }

  return update;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const item = await Insight.findById(id).lean();

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(serializeInsight(item));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch insight." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const existing = await Insight.findById(id);

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const payload = await readInsightUpdatePayload(request);
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

    const previousLocalePublicIds = Object.fromEntries(
      insightLocales.map((locale) => [
        locale,
        existing.translations?.[locale]?.coverImagePublicId || "",
      ])
    ) as Record<InsightLocale, string>;
    const preparedTranslations = await prepareTranslations(payload.translations, id);
    const updateDoc: Record<string, unknown> = {
      type: payload.type,
      published: payload.published,
      featured: payload.featured,
      title: preparedTranslations.az.title,
      slug: preparedTranslations.az.slug,
      excerpt: preparedTranslations.az.excerpt,
      content: preparedTranslations.az.content,
      tags: preparedTranslations.az.tags,
      coverImageUrl: preparedTranslations.az.coverImageUrl ?? "",
      coverImagePublicId: preparedTranslations.az.coverImagePublicId ?? "",
      seoTitle: preparedTranslations.az.seoTitle ?? "",
      seoDescription: preparedTranslations.az.seoDescription ?? "",
      ...buildTranslationUpdate(preparedTranslations),
    };

    await Insight.collection.updateOne(
      { _id: existing._id },
      payload.published
        ? {
            $set: {
              ...updateDoc,
              publishedAt: payload.publishedAt ?? existing.publishedAt ?? new Date(),
            },
          }
        : {
            $set: updateDoc,
            $unset: {
              publishedAt: 1,
            },
          }
    );
    const item = await Insight.findById(id);

    const { deleteInsightImage } = await import("@/lib/insight-images");
    await Promise.all(
      insightLocales.map(async (locale) => {
        const uploadedCoverImage = payload.uploadedCoverImages[locale];
        const previousLocalePublicId = previousLocalePublicIds[locale];

        if (
          uploadedCoverImage?.publicId &&
          previousLocalePublicId &&
          previousLocalePublicId !== uploadedCoverImage.publicId
        ) {
          const stillReferenced =
            existing.coverImagePublicId === previousLocalePublicId ||
            insightLocales.some(
              (candidate) =>
                candidate !== locale &&
                preparedTranslations[candidate].coverImagePublicId === previousLocalePublicId
            );

          if (stillReferenced) {
            return;
          }

          await deleteInsightImage(previousLocalePublicId);
        }
      })
    );

    return NextResponse.json(item ? serializeInsight(item) : null);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update insight." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const deleted = await Insight.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const imagePublicIds = new Set<string>();
    for (const locale of insightLocales) {
      const publicId = deleted.translations?.[locale]?.coverImagePublicId;
      if (publicId) {
        imagePublicIds.add(publicId);
      }
    }
    if (deleted.coverImagePublicId) {
      imagePublicIds.add(deleted.coverImagePublicId);
    }

    const { deleteInsightImage } = await import("@/lib/insight-images");
    await Promise.all(Array.from(imagePublicIds, (publicId) => deleteInsightImage(publicId)));

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete insight." },
      { status: 500 }
    );
  }
}
