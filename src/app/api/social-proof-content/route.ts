import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth-guards";
import { loadSocialProofContent, saveSocialProofContent } from "@/lib/social-proof-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const content = await loadSocialProofContent();
    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch social proof content" },
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
    const content = await saveSocialProofContent(body);

    return NextResponse.json(content);
  } catch {
    return NextResponse.json(
      { error: "Failed to update social proof content" },
      { status: 500 }
    );
  }
}
