"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, MessageSquareText, Paperclip, Send, X } from "lucide-react";
import type { ProjectChatMessageRecord } from "@/lib/project-chat";
import { StatusMessage } from "@/components/ui/StatusMessage";

function formatChatTime(value: string) {
  return new Date(value).toLocaleString("az-AZ", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isImageAttachment(resourceType: string) {
  return resourceType === "image";
}

export function ProjectChatPanel({
  projectId,
  viewerRole,
  title = "Layihə söhbəti",
  description = "Komanda və müştəri arasında bütün yazışmalar burada qalır.",
}: {
  projectId: string;
  viewerRole: "admin" | "client";
  title?: string;
  description?: string;
}) {
  const [messages, setMessages] = useState<ProjectChatMessageRecord[]>([]);
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const realtimeEnabled = useMemo(
    () => Boolean(process.env.NEXT_PUBLIC_PUSHER_KEY && process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function loadMessages() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/projects/${projectId}/messages`, {
          credentials: "include",
          cache: "no-store",
        });
        const data = (await response.json().catch(() => null)) as
          | ProjectChatMessageRecord[]
          | { error?: string }
          | null;

        if (!response.ok) {
          throw new Error(
            data && !Array.isArray(data) && data.error ? data.error : "Mesajlar yüklənmədi."
          );
        }

        if (!cancelled) {
          setMessages(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Mesajlar yüklənmədi.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    if (!realtimeEnabled) {
      return;
    }

    let isMounted = true;
    let pusherInstance: { disconnect(): void } | null = null;
    let subscribedChannel: {
      bind(eventName: string, callback: (payload: ProjectChatMessageRecord) => void): void;
      unbind(eventName: string, callback: (payload: ProjectChatMessageRecord) => void): void;
    } | null = null;

    const channelName = `private-project-${projectId}`;
    const eventName = "project-message-created";
    const handleIncomingMessage = (payload: ProjectChatMessageRecord) => {
      if (!isMounted) return;
      setMessages((current) =>
        current.some((message) => message._id === payload._id) ? current : [...current, payload]
      );
    };

    void import("pusher-js").then(({ default: Pusher }) => {
      if (!isMounted) return;

      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        channelAuthorization: {
          endpoint: "/api/pusher/auth",
          transport: "ajax",
        },
      });

      const channel = pusher.subscribe(channelName);
      channel.bind(eventName, handleIncomingMessage);

      pusherInstance = pusher;
      subscribedChannel = channel;
    });

    return () => {
      isMounted = false;
      if (subscribedChannel) {
        subscribedChannel.unbind(eventName, handleIncomingMessage);
      }
      pusherInstance?.disconnect();
    };
  }, [projectId, realtimeEnabled]);

  async function handleSendMessage() {
    const trimmed = body.trim();
    if (!trimmed && !files.length) return;

    try {
      setSending(true);
      setError(null);

      const formData = new FormData();
      formData.append("body", trimmed);
      files.forEach((file) => formData.append("files", file));

      const response = await fetch(`/api/projects/${projectId}/messages`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = (await response.json().catch(() => null)) as
        | ProjectChatMessageRecord
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          data && !Array.isArray(data) && "error" in data && data.error
            ? data.error
            : "Mesaj göndərilmədi."
        );
      }

      if (data && !("error" in data)) {
        const createdMessage = data as ProjectChatMessageRecord;
        setMessages((current) =>
          current.some((message) => message._id === createdMessage._id)
            ? current
            : [...current, createdMessage]
        );
      }

      setBody("");
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Mesaj göndərilmədi.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="site-card rounded-[28px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-muted">{description}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MessageSquareText className="h-5 w-5" />
        </div>
      </div>

      {!realtimeEnabled ? (
        <StatusMessage tone="warning" title="Realtime aktiv deyil" className="mt-4" compact>
          Realtime chat üçün Pusher env dəyərləri əlavə olunmalıdır. Mesajlar yenə də saxlanılır.
        </StatusMessage>
      ) : null}

      {error ? (
        <StatusMessage tone="error" title="Chat xətası" role="alert" className="mt-4" compact>
          {error}
        </StatusMessage>
      ) : null}

      <div className="mt-5 h-[480px] overflow-y-auto rounded-[24px] border border-border bg-background/40 p-4">
        {loading ? (
          <div className="flex items-center gap-3 text-sm text-muted">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Mesajlar yüklənir...
          </div>
        ) : messages.length ? (
          <div className="space-y-3">
            {messages.map((message) => {
              const ownMessage = message.senderRole === viewerRole;

              return (
                <div
                  key={message._id}
                  className={`flex ${ownMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[22px] px-4 py-3 ${
                      ownMessage
                        ? "bg-primary text-white"
                        : "border border-border bg-white/5 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-xs opacity-80">
                      <span className="font-semibold">{message.senderName}</span>
                      <span>{formatChatTime(message.createdAt)}</span>
                    </div>

                    {message.body ? (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-7">{message.body}</p>
                    ) : null}

                    {message.attachments.length ? (
                      <div className="mt-3 space-y-3">
                        {message.attachments.map((attachment, index) => (
                          <div
                            key={`${attachment.publicId}-${index}`}
                            className={`rounded-2xl border p-3 ${
                              ownMessage
                                ? "border-white/15 bg-white/10"
                                : "border-border bg-background/30"
                            }`}
                          >
                            {isImageAttachment(attachment.resourceType) ? (
                              <a href={attachment.url} target="_blank" rel="noreferrer">
                                <Image
                                  src={attachment.url}
                                  alt={attachment.originalName}
                                  width={attachment.width || 1200}
                                  height={attachment.height || 900}
                                  className="h-auto w-full rounded-xl object-cover"
                                />
                              </a>
                            ) : (
                              <a
                                href={attachment.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 text-sm underline-offset-4 hover:underline"
                              >
                                <Paperclip className="h-4 w-4" />
                                {attachment.originalName}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
        ) : (
          <p className="text-sm text-muted">Hələ mesaj yoxdur. İlk mesajı göndərə bilərsiniz.</p>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {files.length ? (
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <span
                key={`${file.name}-${index}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1.5 text-xs text-foreground"
              >
                {file.name}
                <button
                  type="button"
                  onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  className="text-muted hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <textarea
            rows={4}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Mesajınızı yazın..."
            className="site-input min-h-[120px] flex-1 resize-none rounded-2xl px-4 py-3 text-sm"
          />

          <div className="flex flex-col gap-3 sm:w-[220px]">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary justify-center text-sm"
            >
              <ImagePlus className="h-4 w-4" />
              Foto və fayl
            </button>
            <button
              type="button"
              onClick={() => void handleSendMessage()}
              disabled={sending || (!body.trim() && !files.length)}
              className="btn-primary justify-center text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {sending ? "Göndərilir..." : "Göndər"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
