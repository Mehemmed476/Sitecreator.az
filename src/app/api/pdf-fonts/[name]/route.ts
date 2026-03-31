import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const allowedFonts = new Map<string, string>([
  ["arial.ttf", "arial.ttf"],
  ["arialbd.ttf", "arialbd.ttf"],
]);

export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await context.params;
    const fileName = allowedFonts.get(name);

    if (!fileName) {
      return NextResponse.json({ error: "Font not found" }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "public", "fonts", fileName);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "font/ttf",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load font" }, { status: 500 });
  }
}
