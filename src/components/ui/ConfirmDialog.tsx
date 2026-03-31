"use client";

import { useEffect } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Təsdiqlə",
  cancelText = "Ləğv et",
  confirmTone = "danger",
  loading = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmTone?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [loading, onClose, open]);

  if (!open) return null;

  const confirmClassName =
    confirmTone === "danger"
      ? "border-red-500/20 bg-red-500/12 text-red-50 hover:border-red-400/30 hover:bg-red-500/18"
      : "border-primary/20 bg-primary/14 text-slate-50 hover:border-primary/34 hover:bg-primary/20";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-md"
      onClick={loading ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(11,16,27,0.98),rgba(7,11,19,0.98))] p-6 text-slate-50 shadow-[0_32px_80px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/12 text-red-200 ring-1 ring-red-500/12">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/3 text-slate-300 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Pəncərəni bağla"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-secondary justify-center text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={[
              "inline-flex min-h-[3.5rem] items-center justify-center gap-2 rounded-[1rem] border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
              confirmClassName,
            ].join(" ")}
          >
            <Trash2 className="h-4 w-4" />
            {loading ? "Silinir..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
