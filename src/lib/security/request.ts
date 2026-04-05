import type { NextRequest } from "next/server";
import { AppError } from "@/lib/errors/app-error";

function getTrustedHost(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host")?.trim() ||
    new URL(request.url).host
  );
}

function parseUrl(value: string | null) {
  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

export function assertTrustedRequestOrigin(request: NextRequest) {
  const trustedHost = getTrustedHost(request);
  const origin = parseUrl(request.headers.get("origin"));
  const referer = parseUrl(request.headers.get("referer"));
  const candidate = origin ?? referer;

  if (!candidate) {
    return;
  }

  if (candidate.host !== trustedHost) {
    throw new AppError("Untrusted request origin.", 403);
  }
}

export function assertRequestBodySize(request: NextRequest, maxBytes: number) {
  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : NaN;

  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new AppError("Request payload is too large.", 413);
  }
}
