import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRouteErrorResponse } from "@/lib/http/route-handlers";
import { ensureAdminApiSession } from "@/lib/permissions/session-permissions";
import {
  deleteProjectEntry,
  updateProjectEntry,
} from "@/lib/services/projects/project-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    ensureAdminApiSession(await auth());
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const project = await updateProjectEntry(id, body);
    return NextResponse.json(project);
  } catch (error) {
    return createRouteErrorResponse("api/projects/[id].PATCH", error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    ensureAdminApiSession(await auth());
    const { id } = await params;
    const result = await deleteProjectEntry(id);
    return NextResponse.json(result);
  } catch (error) {
    return createRouteErrorResponse("api/projects/[id].DELETE", error);
  }
}
