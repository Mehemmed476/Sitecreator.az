import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth-guards";
import { connectDB } from "@/lib/db";
import { Portfolio } from "@/lib/models/Portfolio";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

async function readPortfolioUpdatePayload(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const image = formData.get("image");
    const uploadedImage =
      image instanceof File && image.size > 0
        ? await (await import("@/lib/portfolio-images")).savePortfolioImage(image)
        : null;

    return {
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      imageUrl: uploadedImage?.url ?? null,
      imagePublicId: uploadedImage?.publicId ?? null,
      techStack: String(formData.get("techStack") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      projectUrl: String(formData.get("projectUrl") ?? "").trim() || undefined,
    };
  }

  const body = await request.json();

  return {
    title: String(body?.title ?? "").trim(),
    description: String(body?.description ?? "").trim(),
    imageUrl: String(body?.imageUrl ?? "").trim() || null,
    imagePublicId: String(body?.imagePublicId ?? "").trim() || null,
    techStack: Array.isArray(body?.techStack)
      ? body.techStack.map((item: unknown) => String(item).trim()).filter(Boolean)
      : [],
    projectUrl: String(body?.projectUrl ?? "").trim() || undefined,
  };
}

// GET single portfolio item
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
    const item = await Portfolio.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

// PUT update portfolio item
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
    const existingItem = await Portfolio.findById(id);

    if (!existingItem) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const payload = await readPortfolioUpdatePayload(request);

    if (!payload.title || !payload.description) {
      return NextResponse.json(
        { error: "Title and description are required." },
        { status: 400 }
      );
    }

    const nextImageUrl = payload.imageUrl || existingItem.imageUrl;
    const nextImagePublicId = payload.imagePublicId || existingItem.imagePublicId;
    if (!nextImageUrl) {
      return NextResponse.json({ error: "Image is required." }, { status: 400 });
    }

    const item = await Portfolio.findByIdAndUpdate(
      id,
      {
        ...payload,
        imageUrl: nextImageUrl,
        imagePublicId: nextImagePublicId,
      },
      { new: true }
    );

    if (payload.imageUrl && payload.imageUrl !== existingItem.imageUrl) {
      await (await import("@/lib/portfolio-images")).deletePortfolioImage(
        existingItem.imageUrl,
        existingItem.imagePublicId
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update item",
      },
      { status: 500 }
    );
  }
}

// DELETE portfolio item
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
    const deletedItem = await Portfolio.findByIdAndDelete(id);
    await (await import("@/lib/portfolio-images")).deletePortfolioImage(
      deletedItem?.imageUrl,
      deletedItem?.imagePublicId
    );
    return NextResponse.json({ message: "Deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
