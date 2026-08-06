"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/shared/button";
import { LogRow } from "@/components/generator/log-row";
import { useLogs } from "@/hooks/use-logs";

type LogViewerProps = {
  pollFast?: boolean;
};

export function LogViewer({ pollFast = false }: LogViewerProps) {
  const { logs, isLoading, error, refresh } = useLogs({
    pollMs: pollFast ? 2000 : 5000,
    enabled: true,
  });

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Log viewer</h2>
          <p className="text-sm text-[var(--muted)]">
            Auto-refreshes every {pollFast ? "2" : "5"} seconds
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => void refresh()}
          aria-label="Refresh logs"
          type="button"
        >
          <RefreshCw className="size-4" aria-hidden />
          Refresh
        </Button>
      </div>

      {error && (
        <p className="rounded-xl bg-[var(--danger-muted)] px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-xl bg-[var(--surface-2)]"
            />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--muted)]">
          No generation logs yet. Run your first generate above.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {logs.map((log) => (
            <li key={log.id}>
              <LogRow log={log} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
