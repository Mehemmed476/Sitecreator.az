"use client";

import type { ReactNode } from "react";
import { AlertCircle, BadgeCheck, BellRing, Info } from "lucide-react";

type StatusTone = "error" | "success" | "warning" | "info";

const toneMeta: Record<
  StatusTone,
  {
    icon: typeof AlertCircle;
    className: string;
    iconWrapClassName: string;
    titleClassName: string;
  }
> = {
  error: {
    icon: AlertCircle,
    className:
      "border-red-500/18 bg-[linear-gradient(135deg,rgba(127,29,29,0.22),rgba(17,24,39,0.96))] text-red-50 shadow-[0_18px_40px_rgba(127,29,29,0.12)]",
    iconWrapClassName: "bg-red-500/14 text-red-200 ring-1 ring-red-400/18",
    titleClassName: "text-red-100",
  },
  success: {
    icon: BadgeCheck,
    className:
      "border-emerald-500/18 bg-[linear-gradient(135deg,rgba(6,78,59,0.22),rgba(17,24,39,0.96))] text-emerald-50 shadow-[0_18px_40px_rgba(6,78,59,0.12)]",
    iconWrapClassName: "bg-emerald-500/14 text-emerald-200 ring-1 ring-emerald-400/18",
    titleClassName: "text-emerald-100",
  },
  warning: {
    icon: BellRing,
    className:
      "border-amber-500/18 bg-[linear-gradient(135deg,rgba(120,53,15,0.22),rgba(17,24,39,0.96))] text-amber-50 shadow-[0_18px_40px_rgba(120,53,15,0.12)]",
    iconWrapClassName: "bg-amber-500/14 text-amber-200 ring-1 ring-amber-400/18",
    titleClassName: "text-amber-100",
  },
  info: {
    icon: Info,
    className:
      "border-primary/18 bg-[linear-gradient(135deg,rgba(79,70,229,0.18),rgba(17,24,39,0.96))] text-slate-50 shadow-[0_18px_40px_rgba(79,70,229,0.1)]",
    iconWrapClassName: "bg-primary/14 text-primary-light ring-1 ring-primary/20",
    titleClassName: "text-slate-100",
  },
};

export function StatusMessage({
  children,
  title,
  tone = "info",
  role,
  className = "",
  compact = false,
}: {
  children: ReactNode;
  title?: string;
  tone?: StatusTone;
  role?: "alert" | "status";
  className?: string;
  compact?: boolean;
}) {
  const meta = toneMeta[tone];
  const Icon = meta.icon;

  return (
    <div
      role={role}
      className={[
        "status-message relative overflow-hidden rounded-[1.35rem] border backdrop-blur-xl",
        compact ? "px-4 py-3" : "px-4 py-4 sm:px-5",
        meta.className,
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/12" />
      <div className="flex items-start gap-3">
        <div
          className={[
            "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
            meta.iconWrapClassName,
          ].join(" ")}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0 space-y-1">
          {title ? <p className={["text-sm font-semibold", meta.titleClassName].join(" ")}>{title}</p> : null}
          <div className="text-sm leading-6 text-current/88">{children}</div>
        </div>
      </div>
    </div>
  );
}
