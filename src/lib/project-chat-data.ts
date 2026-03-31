import { connectDB } from "@/lib/db";
import { ProjectChatMessage } from "@/lib/models/ProjectChatMessage";
import { Project } from "@/lib/models/Project";
import type { ProjectChatThreadRecord } from "@/lib/project-chat";
import { normalizeObjectId } from "@/lib/project-chat";

function buildLatestMap(
  messages: Array<{
    projectId: { toString(): string };
    body: string;
    createdAt: Date;
    attachments?: Array<{ originalName?: string }>;
  }>
) {
  const latestMap = new Map<
    string,
    {
      latestMessage: string;
      latestMessageAt: string;
    }
  >();

  for (const message of messages) {
    const projectId = message.projectId.toString();
    if (latestMap.has(projectId)) continue;

    latestMap.set(projectId, {
      latestMessage:
        message.body ||
        message.attachments?.[0]?.originalName ||
        "Yeni mesaj",
      latestMessageAt: new Date(message.createdAt).toISOString(),
    });
  }

  return latestMap;
}

export async function getAdminProjectChatThreads(): Promise<ProjectChatThreadRecord[]> {
  await connectDB();

  const [projects, recentMessages] = await Promise.all([
    Project.find().sort({ updatedAt: -1 }).populate("clientId").lean(),
    ProjectChatMessage.find().sort({ createdAt: -1 }).limit(500).lean(),
  ]);

  const latestMap = buildLatestMap(recentMessages);

  return projects.map((project) => {
    const client = project.clientId as unknown as { name?: string };
    const latest = latestMap.get(project._id.toString());

    return {
      projectId: project._id.toString(),
      projectTitle: project.title,
      serviceName: project.serviceName,
      clientName: client?.name || "Müştəri",
      latestMessage: latest?.latestMessage,
      latestMessageAt: latest?.latestMessageAt ?? null,
    };
  });
}

export async function getClientProjectChatThreads(userId: string): Promise<ProjectChatThreadRecord[]> {
  await connectDB();
  const clientId = normalizeObjectId(userId);

  if (!clientId) {
    return [];
  }

  const [projects, recentMessages] = await Promise.all([
    Project.find({ clientId }).sort({ updatedAt: -1 }).lean(),
    ProjectChatMessage.find({}).sort({ createdAt: -1 }).limit(500).lean(),
  ]);

  const latestMap = buildLatestMap(recentMessages);

  return projects.map((project) => {
    const latest = latestMap.get(project._id.toString());

    return {
      projectId: project._id.toString(),
      projectTitle: project.title,
      serviceName: project.serviceName,
      latestMessage: latest?.latestMessage,
      latestMessageAt: latest?.latestMessageAt ?? null,
    };
  });
}
