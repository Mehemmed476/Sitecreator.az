import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRouteErrorResponse } from "@/lib/http/route-handlers";
import { ensureAdminApiSession } from "@/lib/permissions/session-permissions";
import { deleteLeadEntry, updateLeadEntry } from "@/lib/services/leads/lead-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    ensureAdminApiSession(await auth());
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const lead = await updateLeadEntry(id, body);
    return NextResponse.json(lead);
  } catch (error) {
    return createRouteErrorResponse("api/contact/[id].PATCH", error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    ensureAdminApiSession(await auth());
    const { id } = await params;
    await deleteLeadEntry(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return createRouteErrorResponse("api/contact/[id].DELETE", error);
  }
}
