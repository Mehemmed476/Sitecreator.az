import type { Session } from "next-auth";
import { AppError } from "@/lib/errors/app-error";
import { normalizeObjectId } from "@/lib/project-chat";

export function normalizeObjectIdOrThrow(value: string, message: string) {
  const objectId = normalizeObjectId(value);

  if (!objectId) {
    throw new AppError(message, 400);
  }

  return objectId;
}

export function ensureProjectAccess(session: Session, clientId?: { toString(): string } | null) {
  if (session.user.role === "admin") {
    return;
  }

  if (!session.user.id || !clientId || clientId.toString() !== session.user.id) {
    throw new AppError("Forbidden", 403);
  }
}
