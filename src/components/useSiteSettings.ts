"use client";

import {
  defaultSiteSettings,
  sanitizeSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";
import { useRemoteResource } from "@/hooks/useRemoteResource";

export function useSiteSettings() {
  const { data: settings, loading } = useRemoteResource<SiteSettings>({
    url: "/api/site-settings",
    fallback: defaultSiteSettings,
    transform: sanitizeSiteSettings,
  });

  return { settings, loading };
}
