import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth-guards";
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/lib/models/Portfolio";
import {
  normalizePortfolioTranslations,
  portfolioLocales,
} from "@/lib/portfolio-types";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

async function readPortfolioPayload(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const image = formData.get("image");
    const uploadedImage =
      image instanceof File && image.size > 0
        ? await (await import("@/lib/portfolio-images")).savePortfolioImage(image)
        : null;
    const fallbackImageUrl = String(formData.get("imageUrl") ?? "").trim();
    const rawTranslations = String(formData.get("translations") ?? "").trim();
    const parsedTranslations = rawTranslations ? JSON.parse(rawTranslations) : undefined;
    const translations = normalizePortfolioTranslations(parsedTranslations, {
      defaultDescription: String(formData.get("description") ?? "").trim(),
      defaultProjectUrl: String(formData.get("projectUrl") ?? "").trim(),
    });

    return {
      title: String(formData.get("title") ?? "").trim(),
      imageUrl: uploadedImage?.url ?? fallbackImageUrl,
      imagePublicId: uploadedImage?.publicId,
      techStack: String(formData.get("techStack") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      translations,
      description: translations.az.description,
      projectUrl: translations.az.projectUrl,
    };
  }

  const body = await request.json();
  const translations = normalizePortfolioTranslations(body?.translations, {
    defaultDescription: String(body?.description ?? "").trim(),
    defaultProjectUrl: String(body?.projectUrl ?? "").trim(),
  });

  return {
    title: String(body?.title ?? "").trim(),
    imageUrl: String(body?.imageUrl ?? "").trim(),
    imagePublicId: String(body?.imagePublicId ?? "").trim() || undefined,
    techStack: Array.isArray(body?.techStack)
      ? body.techStack.map((item: unknown) => String(item).trim()).filter(Boolean)
      : [],
    translations,
    description: translations.az.description,
    projectUrl: translations.az.projectUrl,
  };
}

// GET all portfolio items
export async function GET() {
  try {
    const session = await auth();
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const items = await Portfolio.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch portfolio items",
      },
      { status: 500 }
    );
  }
}

// POST a new portfolio item
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const payload = await readPortfolioPayload(request);

    const missingLocales = portfolioLocales.filter(
      (locale) => !payload.translations[locale].description.trim()
    );

    if (!payload.title || !payload.imageUrl || missingLocales.length > 0) {
      return NextResponse.json(
        {
          error:
            missingLocales.length > 0
              ? `Descriptions are required for: ${missingLocales.join(", ")}.`
              : "Title and image are required.",
        },
        { status: 400 }
      );
    }

    const item = await Portfolio.create(payload);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create portfolio item",
      },
      { status: 500 }
    );
  }
}
