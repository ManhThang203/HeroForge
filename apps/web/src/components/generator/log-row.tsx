"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/shared/badge";
import { cn } from "@/lib/cn";
import type { GenerationLog } from "@/types/api";

type LogRowProps = {
  log: GenerationLog;
};

/** Format thời gian log cho người dùng. */
function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function LogRow({ log }: LogRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="rounded-xl border border-[var(--border)] bg-[var(--surface)]"
    >
      <Collapsible.Trigger asChild>
        <button
          type="button"
          className="flex min-h-14 w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          aria-label={`Toggle details for ${log.name}`}
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{log.name}</p>
            <p className="truncate text-xs text-[var(--muted)]">
              {formatTime(log.createdAt)}
              {log.latencyMs != null ? ` · ${log.latencyMs} ms` : ""}
            </p>
          </div>
          <StatusBadge status={log.status} />
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-[var(--muted)] transition-transform",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content className="border-t border-[var(--border)] px-4 py-3">
        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="text-[var(--muted)]">Model</dt>
            <dd className="font-mono text-xs break-all">{log.model}</dd>
          </div>
          {log.httpStatus != null && (
            <div>
              <dt className="text-[var(--muted)]">HTTP status</dt>
              <dd>{log.httpStatus}</dd>
            </div>
          )}
          {log.errorMessage && (
            <div>
              <dt className="text-[var(--muted)]">Error</dt>
              <dd className="text-[var(--danger)]">{log.errorMessage}</dd>
            </div>
          )}
          <div>
            <dt className="mb-1 text-[var(--muted)]">Request payload</dt>
            <dd>
              <pre className="max-h-40 overflow-auto rounded-lg bg-[var(--surface-2)] p-3 text-xs whitespace-pre-wrap break-all">
                {JSON.stringify(log.requestPayload, null, 2)}
              </pre>
            </dd>
          </div>
          {log.responseSummary != null && (
            <div>
              <dt className="mb-1 text-[var(--muted)]">Response summary</dt>
              <dd>
                <pre className="max-h-40 overflow-auto rounded-lg bg-[var(--surface-2)] p-3 text-xs whitespace-pre-wrap break-all">
                  {JSON.stringify(log.responseSummary, null, 2)}
                </pre>
              </dd>
            </div>
          )}
          {log.resultImageUrl && (
            <div>
              <dt className="text-[var(--muted)]">Result</dt>
              <dd>
                <a
                  href={log.resultImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer text-[var(--accent)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  Open result image
                </a>
              </dd>
            </div>
          )}
        </dl>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
