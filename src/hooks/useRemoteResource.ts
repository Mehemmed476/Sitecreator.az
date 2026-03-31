"use client";

import { useEffect, useState } from "react";

export function useRemoteResource<T>({
  url,
  fallback,
  transform,
}: {
  url: string;
  fallback: T;
  transform?: (value: unknown) => T;
}) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch(url, { cache: "no-store" });
        const value = await response.json().catch(() => null);

        if (!response.ok || !active) {
          return;
        }

        setData(transform ? transform(value) : (value as T));
      } catch {
        // Keep fallback values when the endpoint is unavailable.
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [fallback, transform, url]);

  return { data, loading, setData };
}
