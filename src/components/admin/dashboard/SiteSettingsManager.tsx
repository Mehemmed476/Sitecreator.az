"use client";

import { useCallback, useEffect, useState } from "react";
import { AtSign, Clock, Mail, MapPin, MessageCircle, Phone, Save } from "lucide-react";
import { defaultSiteSettings } from "@/lib/site-settings";
import {
  AdminAlert,
  AdminLoadingState,
  AdminSectionHeader,
} from "@/components/admin/dashboard/shared";
import type { SiteSettingsData } from "@/components/admin/dashboard/types";

const fields = [
  { key: "email", label: "Email", icon: Mail, type: "email" },
  { key: "phone", label: "Telefon", icon: Phone, type: "text" },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, type: "text" },
  { key: "instagram", label: "Instagram", icon: AtSign, type: "text" },
  { key: "businessHours", label: "İş saatları", icon: Clock, type: "text" },
  { key: "address", label: "Ünvan", icon: MapPin, type: "text" },
] as const;

export function SiteSettingsManager() {
  const [form, setForm] = useState<SiteSettingsData>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch("/api/site-settings", { credentials: "include" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(res.status === 401 ? "Zəhmət olmasa yenidən daxil olun." : "Əlaqə ayarlarını yükləmək olmadı.");
        return;
      }

      setForm({
        email: String(data?.email ?? defaultSiteSettings.email),
        phone: String(data?.phone ?? defaultSiteSettings.phone),
        whatsapp: String(data?.whatsapp ?? defaultSiteSettings.whatsapp),
        instagram: String(data?.instagram ?? defaultSiteSettings.instagram),
        businessHours: String(data?.businessHours ?? defaultSiteSettings.businessHours),
        address: String(data?.address ?? defaultSiteSettings.address),
      });
    } catch {
      setError("Əlaqə ayarlarını yükləmək olmadı.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error ? String(data.error) : "Əlaqə ayarlarını saxlamaq olmadı.");
        return;
      }

      setForm({
        email: String(data?.email ?? form.email),
        phone: String(data?.phone ?? form.phone),
        whatsapp: String(data?.whatsapp ?? form.whatsapp),
        instagram: String(data?.instagram ?? form.instagram),
        businessHours: String(data?.businessHours ?? form.businessHours),
        address: String(data?.address ?? form.address),
      });
      setSuccess("Əlaqə ayarları yeniləndi.");
    } catch {
      setError("Əlaqə ayarlarını saxlamaq olmadı.");
    } finally {
      setSaving(false);
    }
  }

  function updateField<K extends keyof SiteSettingsData>(key: K, value: SiteSettingsData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <AdminSectionHeader
        title="Əlaqə məlumatları"
        description="Footer və əlaqə səhifəsi bu məlumatları eyni mənbədən oxuyur."
        actions={
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="btn-primary cursor-pointer text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saxlanılır..." : "Yadda saxla"}
          </button>
        }
      />

      {error ? <AdminAlert role="alert">{error}</AdminAlert> : null}
      {success ? <AdminAlert tone="success" role="status">{success}</AdminAlert> : null}

      {loading ? (
        <AdminLoadingState />
      ) : (
        <div className="admin-panel rounded-[28px] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map(({ key, label, icon: Icon, type }) => (
              <div key={key} className={key === "address" ? "md:col-span-2" : ""}>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(event) => updateField(key, event.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
