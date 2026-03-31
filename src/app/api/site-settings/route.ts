import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth-guards";
import { connectDB } from "@/lib/db";
import { SiteSettingsModel } from "@/lib/models/SiteSettings";
import {
  defaultSiteSettings,
  sanitizeSiteSettings,
} from "@/lib/site-settings";

async function ensureSiteSettings() {
  await connectDB();

  const existing = await SiteSettingsModel.findOne({ singletonKey: "main" }).lean();
  if (existing) {
    return sanitizeSiteSettings(existing);
  }

  const created = await SiteSettingsModel.create({
    singletonKey: "main",
    ...defaultSiteSettings,
  });

  return sanitizeSiteSettings(created.toObject());
}

export async function GET() {
  try {
    const settings = await ensureSiteSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const nextSettings = sanitizeSiteSettings(body);

    await connectDB();
    await SiteSettingsModel.findOneAndUpdate(
      { singletonKey: "main" },
      { singletonKey: "main", ...nextSettings },
      { upsert: true, new: true }
    );

    return NextResponse.json(nextSettings);
  } catch {
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    );
  }
}
