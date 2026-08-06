"use client";

import { Download, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/shared/button";
import type { GenerateResult } from "@/types/api";

type GenerateResultPanelProps = {
  result: GenerateResult | null;
  isGenerating: boolean;
  onReset: () => void;
};

/** Tạo URL Cloudinary với fl_attachment để trình duyệt tải file thay vì mở ảnh. */
function toCloudinaryAttachmentUrl(url: string, filename: string): string {
  const baseName = filename.replace(/\.[^.]+$/, "");
  return url.replace(
    "/upload/",
    `/upload/fl_attachment:${encodeURIComponent(baseName)}/`,
  );
}

/** Tải ảnh về máy: ưu tiên blob local; fallback fl_attachment của Cloudinary. */
async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch image");
    }

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    const anchor = document.createElement("a");
    anchor.href = toCloudinaryAttachmentUrl(url, filename);
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }
}

export function GenerateResultPanel({
  result,
  isGenerating,
  onReset,
}: GenerateResultPanelProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (isGenerating) {
    return (
      <section
        aria-busy="true"
        aria-live="polite"
        className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        <h2 className="text-lg font-semibold">Generating your hero…</h2>
        <div className="aspect-square w-full animate-pulse rounded-xl bg-[var(--surface-2)]" />
        <p className="text-sm text-[var(--muted)]">
          This usually takes 30–90 seconds. Keep this tab open.
        </p>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-center">
        <h2 className="text-lg font-semibold">Result</h2>
        <p className="max-w-sm text-sm text-[var(--muted)]">
          Your watermarked superhero portrait will appear here after generation.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Your superhero</h2>
        <p className="text-sm text-[var(--muted)]">{result.latencyMs} ms</p>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={result.resultImageUrl}
        alt="Generated superhero with name watermark"
        className="aspect-square w-full rounded-xl object-cover"
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={isDownloading}
          onClick={() => {
            void (async () => {
              setIsDownloading(true);
              try {
                await downloadImage(
                  result.resultImageUrl,
                  `heroforge-${result.logId}.png`,
                );
                toast.success("Image saved to your device");
              } catch {
                toast.error("Could not download image. Try again.");
              } finally {
                setIsDownloading(false);
              }
            })();
          }}
        >
          <Download className="size-4" aria-hidden />
          {isDownloading ? "Downloading…" : "Download"}
        </Button>
        <Button variant="secondary" onClick={onReset} type="button">
          <RotateCcw className="size-4" aria-hidden />
          New generate
        </Button>
      </div>
    </section>
  );
}
