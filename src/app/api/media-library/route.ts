import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth-guards";
import {
  listMediaLibraryAssets,
  uploadMediaLibraryAsset,
} from "@/lib/media-library";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const assets = await listMediaLibraryAssets();
    return NextResponse.json(assets, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch media library" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    const asset = await uploadMediaLibraryAsset(file);
    return NextResponse.json(asset);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload media asset",
      },
      { status: 500 }
    );
  }
}
