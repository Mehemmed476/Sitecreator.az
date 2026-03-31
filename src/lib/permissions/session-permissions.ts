import type { Session } from "next-auth";
import { AppError } from "@/lib/errors/app-error";

export function ensureAuthenticatedSession(session: Session | null | undefined) {
  if (!session?.user) {
    throw new AppError("Unauthorized", 401);
  }

  return session;
}

export function ensureAdminApiSession(session: Session | null | undefined) {
  const activeSession = ensureAuthenticatedSession(session);

  if (activeSession.user.role !== "admin") {
    throw new AppError("Unauthorized", 401);
  }

  return activeSession;
}

export function ensurePortalApiSession(session: Session | null | undefined) {
  return ensureAuthenticatedSession(session);
}
