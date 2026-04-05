import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { getProjectChatChannel, normalizeObjectId } from "@/lib/project-chat";
import { getPusherServer } from "@/lib/pusher-server";
import { assertRequestBodySize, assertTrustedRequestOrigin, getClientIp } from "@/lib/security/request";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    assertTrustedRequestOrigin(request);
    assertRequestBodySize(request, 8 * 1024);
    enforceRateLimit({
      key: `pusher-auth:${getClientIp(request)}`,
      limit: 60,
      windowMs: 60 * 1000,
    });
    const session = await auth();
    if (!session?.user?.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pusher = getPusherServer();
    if (!pusher) {
      return NextResponse.json({ error: "Realtime is not configured" }, { status: 503 });
    }

    const formData = await request.formData();
    const socketId = formData.get("socket_id");
    const channelName = formData.get("channel_name");

    if (typeof socketId !== "string" || typeof channelName !== "string") {
      return NextResponse.json({ error: "Invalid auth payload" }, { status: 400 });
    }

    const prefix = "private-project-";
    if (!channelName.startsWith(prefix)) {
      return NextResponse.json({ error: "Invalid channel" }, { status: 403 });
    }

    const projectId = channelName.slice(prefix.length);
    const normalizedProjectId = normalizeObjectId(projectId);
    if (!normalizedProjectId) {
      return NextResponse.json({ error: "Invalid project" }, { status: 400 });
    }

    await connectDB();

    const project = await Project.findById(normalizedProjectId).lean();
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (
      session.user.role !== "admin" &&
      (!session.user.id || project.clientId?.toString() !== session.user.id)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const authResponse = pusher.authorizeChannel(
      socketId,
      getProjectChatChannel(projectId),
      session.user.role === "admin"
        ? { user_id: "admin", user_info: { role: "admin", name: session.user.name || "Admin" } }
        : {
            user_id: session.user.id,
            user_info: { role: "client", name: session.user.name || "Client" },
          }
    );

    return NextResponse.json(authResponse);
  } catch {
    return NextResponse.json({ error: "Failed to authorize realtime access" }, { status: 500 });
  }
}
