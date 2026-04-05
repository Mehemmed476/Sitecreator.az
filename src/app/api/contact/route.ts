import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRouteErrorResponse } from "@/lib/http/route-handlers";
import { ensureAdminApiSession } from "@/lib/permissions/session-permissions";
import { assertRequestBodySize, assertTrustedRequestOrigin, getClientIp } from "@/lib/security/request";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { createLeadEntry, listLeadsForAdmin } from "@/lib/services/leads/lead-service";

export async function GET() {
  try {
    ensureAdminApiSession(await auth());
    const messages = await listLeadsForAdmin();
    return NextResponse.json(messages);
  } catch (error) {
    return createRouteErrorResponse("api/contact.GET", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    assertTrustedRequestOrigin(request);
    assertRequestBodySize(request, 32 * 1024);
    enforceRateLimit({
      key: `contact:${getClientIp(request)}`,
      limit: 6,
      windowMs: 10 * 60 * 1000,
    });
    const body = await request.json();
    const contact = await createLeadEntry(body);
    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    return createRouteErrorResponse("api/contact.POST", error);
  }
}
