import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MANAT, formatMoneyValue } from "@/lib/price-calculator-estimate";
import {
  createInstagramDraftForPackage,
  getLocalizedPackageContent,
  packageLocales,
  type PackageLocale,
} from "@/lib/package-solutions";
import { getPackageSolutionById } from "@/lib/package-solutions-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const size = {
  width: 1080,
  height: 1350,
};

let fontPromise:
  | Promise<
      [
        { name: string; data: ArrayBuffer; style: "normal"; weight: 400 },
        { name: string; data: ArrayBuffer; style: "normal"; weight: 700 },
      ]
    >
  | null = null;

function toArrayBuffer(buffer: Buffer<ArrayBufferLike>) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
}

async function getFonts() {
  if (!fontPromise) {
    fontPromise = Promise.all([
      readFile(join(process.cwd(), "public", "fonts", "arial.ttf")),
      readFile(join(process.cwd(), "public", "fonts", "arialbd.ttf")),
    ]).then(([regular, bold]) => [
      { name: "Arial Custom", data: toArrayBuffer(regular), style: "normal" as const, weight: 400 as const },
      { name: "Arial Custom", data: toArrayBuffer(bold), style: "normal" as const, weight: 700 as const },
    ]);
  }

  return fontPromise;
}

function normalizeLocale(value: string | null): PackageLocale {
  if (value && packageLocales.includes(value as PackageLocale)) {
    return value as PackageLocale;
  }
  return "az";
}

function cleanLines(values: string[]) {
  return values.filter(Boolean).slice(0, 4);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get("packageId");
    const locale = normalizeLocale(searchParams.get("locale"));
    const frame = searchParams.get("frame") ?? "cover";

    if (!packageId) {
      return new Response("Package ID is required.", { status: 400 });
    }

    const pkg = await getPackageSolutionById(packageId);

    if (!pkg) {
      return new Response("Package not found.", { status: 404 });
    }

    const content = getLocalizedPackageContent(pkg, locale);
    const draft =
      content.instagram.coverTitle || content.instagram.slides.some((slide) => slide.title || slide.body)
        ? content.instagram
        : createInstagramDraftForPackage(locale, pkg);
    const fonts = await getFonts();
    const slideIndex = frame === "cover" ? -1 : Math.max(0, Number(frame) - 1);
    const slide = slideIndex >= 0 ? draft.slides[slideIndex] : null;
    const bullets = cleanLines(content.includedModules);
    const audience = cleanLines(content.perfectFor);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            position: "relative",
            background: "linear-gradient(160deg, #050816 0%, #0b1120 52%, #161f37 100%)",
            color: "#f8fafc",
            fontFamily: "Arial Custom",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "auto auto -140px -120px",
              width: 520,
              height: 520,
              borderRadius: 999,
              background: "rgba(99, 102, 241, 0.24)",
              filter: "blur(20px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "-120px -100px auto auto",
              width: 420,
              height: 420,
              borderRadius: 999,
              background: "rgba(14, 165, 233, 0.18)",
              filter: "blur(12px)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 42,
              borderRadius: 44,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              display: "flex",
              flexDirection: "column",
              padding: 64,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#93c5fd" }}>
                  Sitecreator
                </div>
                <div style={{ marginTop: 12, fontSize: 22, color: "rgba(255,255,255,0.7)" }}>
                  {content.heroBadge || content.cardTitle}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 22px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  fontSize: 22,
                  color: "rgba(255,255,255,0.82)",
                }}
              >
                {frame === "cover" ? "Cover" : `Slide ${slideIndex + 2}`}
              </div>
            </div>

            {frame === "cover" ? (
              <div style={{ display: "flex", flexDirection: "column", marginTop: 84 }}>
                <div style={{ fontSize: 96, lineHeight: 1.02, fontWeight: 700 }}>
                  {draft.coverTitle || content.cardTitle}
                </div>
                <div style={{ marginTop: 24, fontSize: 42, lineHeight: 1.24, color: "rgba(255,255,255,0.82)" }}>
                  {draft.coverSubtitle || `${MANAT} ${formatMoneyValue(locale, pkg.startingPrice)} ilə start`}
                </div>

                <div
                  style={{
                    marginTop: 60,
                    display: "flex",
                    gap: 18,
                    flexWrap: "wrap",
                  }}
                >
                  {[...audience.slice(0, 2), ...bullets.slice(0, 2)].map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      style={{
                        display: "flex",
                        padding: "14px 20px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.08)",
                        fontSize: 26,
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 28, color: "rgba(255,255,255,0.65)" }}>{content.timelineLabel}</div>
                    <div style={{ marginTop: 14, fontSize: 54, fontWeight: 700 }}>
                      {`${MANAT} ${formatMoneyValue(locale, pkg.startingPrice)}`}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      padding: "18px 28px",
                      borderRadius: 999,
                      background: "#7c83ff",
                      color: "#ffffff",
                      fontSize: 28,
                      fontWeight: 700,
                    }}
                  >
                    {draft.cta || content.primaryCta}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", marginTop: 70, height: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignSelf: "flex-start",
                    padding: "14px 20px",
                    borderRadius: 999,
                    background: "rgba(124,131,255,0.18)",
                    fontSize: 24,
                    color: "#c7d2fe",
                  }}
                >
                  {content.cardTitle}
                </div>

                <div style={{ marginTop: 34, fontSize: 78, lineHeight: 1.06, fontWeight: 700 }}>
                  {slide?.title || content.cardTitle}
                </div>

                <div
                  style={{
                    marginTop: 34,
                    fontSize: 40,
                    lineHeight: 1.38,
                    color: "rgba(255,255,255,0.84)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {slide?.body || content.cardDescription}
                </div>

                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 32,
                    borderTop: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 24, color: "rgba(255,255,255,0.62)" }}>sitecreator.az</div>
                    <div style={{ marginTop: 10, fontSize: 28 }}>{draft.cta || content.primaryCta}</div>
                  </div>
                  <div style={{ fontSize: 28, color: "rgba(255,255,255,0.72)" }}>
                    {`${slideIndex + 2}/${draft.slides.length + 1}`}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      {
        ...size,
        fonts,
        headers: {
          "content-type": "image/png",
          "cache-control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate preview.";
    return new Response(message, { status: 500 });
  }
}
