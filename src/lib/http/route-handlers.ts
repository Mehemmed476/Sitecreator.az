import { NextResponse } from "next/server";
import { AppError, isAppError } from "@/lib/errors/app-error";
import { logServerError } from "@/lib/logging/server-logger";

export function assert(condition: unknown, message: string, status = 400): asserts condition {
  if (!condition) {
    throw new AppError(message, status);
  }
}

export function createRouteErrorResponse(scope: string, error: unknown) {
  if (isAppError(error)) {
    if (error.status >= 500) {
      logServerError(scope, error);
    }

    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  logServerError(scope, error);
  return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
}
