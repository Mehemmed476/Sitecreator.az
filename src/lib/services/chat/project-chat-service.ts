import type { Session } from "next-auth";
import { connectDB } from "@/lib/db";
import { AppError } from "@/lib/errors/app-error";
import { ensureProjectAccess, normalizeObjectIdOrThrow } from "@/lib/permissions/project-permissions";
import { createProjectChatMessage, listProjectMessages } from "@/lib/repositories/project-chat-repository";
import { findProjectById } from "@/lib/repositories/project-repository";
import {
  getProjectChatChannel,
  getProjectChatEventName,
  type ProjectChatMessageRecord,
} from "@/lib/project-chat";
import { uploadProjectChatAttachments } from "@/lib/project-chat-attachments";
import { getPusherServer } from "@/lib/pusher-server";

const MAX_MESSAGE_LENGTH = 4000;
const MAX_ATTACHMENT_COUNT = 5;

function mapMessage(message: {
  _id: { toString(): string };
  projectId: { toString(): string };
  proposalId?: { toString(): string } | null;
  senderRole: "admin" | "client";
  senderName: string;
  body: string;
  attachments?: Array<{
    url: string;
    publicId: string;
    originalName: string;
    resourceType: string;
    format?: string;
    bytes?: number;
    width?: number;
    height?: number;
  }>;
  createdAt: Date;
}): ProjectChatMessageRecord {
  return {
    _id: message._id.toString(),
    projectId: message.projectId.toString(),
    proposalId: message.proposalId?.toString?.() ?? null,
    senderRole: message.senderRole,
    senderName: message.senderName,
    body: message.body,
    attachments: Array.isArray(message.attachments) ? message.attachments : [],
    createdAt: new Date(message.createdAt).toISOString(),
  };
}

function isUploadFile(entry: FormDataEntryValue): entry is File {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "arrayBuffer" in entry &&
    "name" in entry &&
    "size" in entry &&
    typeof (entry as File).arrayBuffer === "function" &&
    typeof (entry as File).name === "string" &&
    typeof (entry as File).size === "number" &&
    (entry as File).size > 0
  );
}

async function resolveProject(session: Session, projectId: string) {
  await connectDB();
  const normalizedProjectId = normalizeObjectIdOrThrow(projectId, "Invalid project id");
  const project = await findProjectById(normalizedProjectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  ensureProjectAccess(session, project.clientId);
  return project;
}

export async function listProjectMessagesForSession(session: Session, projectId: string) {
  const project = await resolveProject(session, projectId);
  const messages = await listProjectMessages(project._id);
  return messages.map((message) => mapMessage(message));
}

export async function createProjectMessageForSession(
  session: Session,
  projectId: string,
  input: { body?: string; files?: FormDataEntryValue[] }
) {
  const project = await resolveProject(session, projectId);
  const messageBody = typeof input.body === "string" ? input.body.trim() : "";
  const files = Array.isArray(input.files) ? input.files.filter(isUploadFile) : [];

  if (!messageBody && !files.length) {
    throw new AppError("Message or attachment is required", 400);
  }

  if (messageBody.length > MAX_MESSAGE_LENGTH) {
    throw new AppError("Message is too long", 400);
  }

  if (files.length > MAX_ATTACHMENT_COUNT) {
    throw new AppError("Too many attachments", 400);
  }

  const attachments = files.length ? await uploadProjectChatAttachments(files) : [];
  const message = await createProjectChatMessage({
    projectId: project._id,
    proposalId: project.proposalId ?? null,
    senderRole: session.user.role === "admin" ? "admin" : "client",
    senderUserId:
      session.user.role === "client" && session.user.id
        ? normalizeObjectIdOrThrow(session.user.id, "Invalid client id")
        : null,
    senderName: session.user.name || (session.user.role === "admin" ? "Admin" : "Client"),
    body: messageBody,
    attachments,
  });

  const payload = mapMessage(message);
  const pusher = getPusherServer();

  if (pusher) {
    await pusher.trigger(getProjectChatChannel(projectId), getProjectChatEventName(), payload);
  }

  return payload;
}
