"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchLogs } from "@/lib/api";
import type { GenerationLog } from "@/types/api";

type UseLogsOptions = {
  pollMs?: number;
  enabled?: boolean;
  limit?: number;
};

/** Poll GET /api/logs; tăng tần suất khi đang generate. */
export function useLogs(options: UseLogsOptions = {}) {
  const { pollMs = 5000, enabled = true, limit = 50 } = options;
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchLogs(limit);
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load logs");
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (!enabled) return;

    void refresh();
    const id = window.setInterval(() => {
      void refresh();
    }, pollMs);

    return () => window.clearInterval(id);
  }, [enabled, pollMs, refresh]);

  return { logs, isLoading, error, refresh };
}
