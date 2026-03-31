import { redirect } from "next/navigation";
import { Types } from "mongoose";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";

export function isAdminSession(session: Session | null | undefined) {
  return session?.user?.role === "admin";
}

export function isClientSession(session: Session | null | undefined) {
  return session?.user?.role === "client";
}

export async function requireAdminSession(locale: string) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  if (!isAdminSession(session)) {
    redirect(`/${locale}/portal`);
  }

  return session;
}

export async function requireClientSession(locale: string) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/portal/login`);
  }

  if (isAdminSession(session)) {
    redirect(`/${locale}/admin`);
  }

  if (!isClientSession(session)) {
    redirect(`/${locale}/portal/login`);
  }

  if (!Types.ObjectId.isValid(session.user.id)) {
    redirect(`/${locale}/admin`);
  }

  return session;
}

export async function requirePortalSession(locale: string) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/portal/login`);
  }

  return session;
}
