import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRouteErrorResponse } from "@/lib/http/route-handlers";
import { ensureAdminApiSession } from "@/lib/permissions/session-permissions";
import { updateProposalEntry } from "@/lib/services/proposals/proposal-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    ensureAdminApiSession(await auth());
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const proposal = await updateProposalEntry(id, body);
    return NextResponse.json(proposal);
  } catch (error) {
    return createRouteErrorResponse("api/proposals/[id].PATCH", error);
  }
}
