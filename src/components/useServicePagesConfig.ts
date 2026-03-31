"use client";

import { useMemo } from "react";
import { useRemoteResource } from "@/hooks/useRemoteResource";
import {
  defaultServicePagesConfig,
  sanitizeServicePagesConfig,
} from "@/lib/service-pages";

export function useServicePagesConfig() {
  const fallback = useMemo(() => defaultServicePagesConfig, []);
  const transform = useMemo(() => sanitizeServicePagesConfig, []);

  const { data, loading, setData } = useRemoteResource({
    url: "/api/service-pages",
    fallback,
    transform,
  });

  return {
    config: data,
    loading,
    setConfig: setData,
  };
}
