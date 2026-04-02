import type { Types } from "mongoose";
import { ProjectChatMessage, type IProjectChatMessage } from "@/lib/models/ProjectChatMessage";

export function listProjectMessages(projectId: Types.ObjectId) {
  return ProjectChatMessage.find({ projectId }).sort({ createdAt: 1 }).limit(200).lean();
}

export function listRecentProjectMessages(limit = 500) {
  return ProjectChatMessage.find().sort({ createdAt: -1 }).limit(limit).lean();
}

export function createProjectChatMessage(data: Partial<IProjectChatMessage>) {
  return ProjectChatMessage.create(data);
}

export function deleteProjectMessages(projectId: string | Types.ObjectId) {
  return ProjectChatMessage.deleteMany({ projectId });
}
