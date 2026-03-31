import { Types } from "mongoose";

export type ProjectChatMessageRecord = {
  _id: string;
  projectId: string;
  proposalId?: string | null;
  senderRole: "admin" | "client";
  senderName: string;
  body: string;
  attachments: Array<{
    url: string;
    publicId: string;
    originalName: string;
    resourceType: string;
    format?: string;
    bytes?: number;
    width?: number;
    height?: number;
  }>;
  createdAt: string;
};

export type ProjectChatThreadRecord = {
  projectId: string;
  projectTitle: string;
  serviceName: string;
  clientName?: string;
  latestMessage?: string;
  latestMessageAt?: string | null;
};

export function getProjectChatChannel(projectId: string) {
  return `private-project-${projectId}`;
}

export function getProjectChatEventName() {
  return "project-message-created";
}

export function normalizeObjectId(value: string) {
  if (!Types.ObjectId.isValid(value)) {
    return null;
  }

  return new Types.ObjectId(value);
}
