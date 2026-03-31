import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth-guards";
import { deleteMediaLibraryAsset } from "@/lib/media-library";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ publicId: string[] }> }
) {
  try {
    const session = await auth();
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const publicId = Array.isArray(params.publicId) ? params.publicId.join("/") : "";

    if (!publicId) {
      return NextResponse.json({ error: "Invalid media asset id" }, { status: 400 });
    }

    await deleteMediaLibraryAsset(publicId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete media asset" },
      { status: 500 }
    );
  }
}
