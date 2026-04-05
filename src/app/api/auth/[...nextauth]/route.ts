import type { NextRequest } from "next/server";
import { handlers } from "@/lib/auth";
import { assertRequestBodySize, assertTrustedRequestOrigin, getClientIp } from "@/lib/security/request";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export const { GET } = handlers;

export async function POST(request: NextRequest) {
  assertTrustedRequestOrigin(request);
  assertRequestBodySize(request, 24 * 1024);
  enforceRateLimit({
    key: `auth:${getClientIp(request)}`,
    limit: 12,
    windowMs: 10 * 60 * 1000,
  });

  return handlers.POST(request);
}
