import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { StatusMessage } from "@/components/ui/StatusMessage";

export function AdminSectionHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

export function AdminAlert({
  children,
  title,
  tone = "error",
  role,
}: {
  children: ReactNode;
  title?: string;
  tone?: "error" | "success" | "warning" | "info";
  role?: "alert" | "status";
}) {
  return (
    <StatusMessage
      title={title}
      tone={tone}
      role={role}
      className="mb-4 admin-status-message"
      compact
    >
      {children}
    </StatusMessage>
  );
}

export function AdminConfirmDialog(props: Parameters<typeof ConfirmDialog>[0]) {
  return <ConfirmDialog {...props} />;
}

export function AdminLoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary/30 border-t-primary" />
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="admin-panel-soft rounded-[28px] border border-dashed border-border py-16 text-center">
      {Icon ? <Icon className="mx-auto mb-3 h-10 w-10 text-muted" /> : null}
      <p className="text-muted">{title}</p>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
