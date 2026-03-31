import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRouteErrorResponse } from "@/lib/http/route-handlers";
import { ensurePortalApiSession } from "@/lib/permissions/session-permissions";
import {
  createProjectMessageForSession,
  listProjectMessagesForSession,
} from "@/lib/services/chat/project-chat-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = ensurePortalApiSession(await auth());
    const { id } = await params;
    const messages = await listProjectMessagesForSession(session, id);
    return NextResponse.json(messages);
  } catch (error) {
    return createRouteErrorResponse("api/projects/[id]/messages.GET", error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = ensurePortalApiSession(await auth());
    const { id } = await params;
    const contentType = request.headers.get("content-type") || "";
    let body = "";
    let files: FormDataEntryValue[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = typeof formData.get("body") === "string" ? String(formData.get("body")) : "";
      files = formData.getAll("files");
    } else {
      const payload = await request.json().catch(() => ({}));
      body = typeof payload.body === "string" ? payload.body : "";
    }

    const message = await createProjectMessageForSession(session, id, { body, files });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return createRouteErrorResponse("api/projects/[id]/messages.POST", error);
  }
}
