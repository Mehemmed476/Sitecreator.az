import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth-guards";
import { connectDB } from "@/lib/db";
import { HomepageFeatured } from "@/lib/models/HomepageFeatured";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const doc = await HomepageFeatured.findOne();
    return NextResponse.json({
      projectIds: doc?.projectIds ?? [],
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch featured projects" },
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
    const projectIds = body?.projectIds;

    if (!Array.isArray(projectIds)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const normalized = projectIds
      .map((id: unknown) => (typeof id === "string" ? id : ""))
      .filter(Boolean)
      .slice(0, 3);

    await connectDB();

    await HomepageFeatured.findOneAndUpdate(
      {},
      { projectIds: normalized },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update featured projects" },
      { status: 500 }
    );
  }
}
