import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth-guards";
import { connectDB } from "@/lib/db";
import {
  defaultHomepageContent,
  sanitizeHomepageContent,
} from "@/lib/homepage-content";
import { HomepageContentModel } from "@/lib/models/HomepageContent";

async function ensureHomepageContent() {
  await connectDB();

  const existing = await HomepageContentModel.findOne({ singletonKey: "main" }).lean();
  if (existing?.content) {
    return sanitizeHomepageContent(existing.content);
  }

  const created = await HomepageContentModel.create({
    singletonKey: "main",
    content: defaultHomepageContent,
  });

  return sanitizeHomepageContent(created.toObject().content);
}

export async function GET() {
  try {
    const content = await ensureHomepageContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Failed to fetch homepage content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const nextContent = sanitizeHomepageContent(body);

    await connectDB();
    await HomepageContentModel.findOneAndUpdate(
      { singletonKey: "main" },
      { singletonKey: "main", content: nextContent },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json(nextContent);
  } catch {
    return NextResponse.json({ error: "Failed to update homepage content" }, { status: 500 });
  }
}
