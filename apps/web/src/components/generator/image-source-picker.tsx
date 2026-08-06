"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/shared/button";
import { CameraCapture } from "@/components/generator/camera-capture";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

type ImageSourcePickerProps = {
  image: Blob | null;
  filename: string | null;
  onChange: (image: Blob | null, filename: string | null) => void;
};

export function ImageSourcePicker({
  image,
  filename,
  onChange,
}: ImageSourcePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  /** Validate MIME/size rồi set ảnh upload. */
  function handleFile(file: File | undefined) {
    if (!file) return;

    if (!ALLOWED.includes(file.type)) {
      toast.error("Only JPEG, PNG, or WebP images are allowed");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image must be 5MB or smaller");
      return;
    }

    onChange(file, file.name);
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-[var(--muted)]">Photo</span>

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={filename ? `Preview of ${filename}` : "Selected photo preview"}
            className="aspect-square w-full object-cover"
          />
          <div className="absolute bottom-3 right-3">
            <Button
              variant="danger"
              className="min-h-11"
              onClick={() => onChange(null, null)}
              aria-label="Remove photo"
              type="button"
            >
              <Trash2 className="size-4" aria-hidden />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--muted)]">
            Upload a clear portrait or capture with your camera. Max 5MB.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="size-4" aria-hidden />
              Upload photo
            </Button>
            <CameraCapture
              onCapture={(blob) => onChange(blob, "camera-capture.jpg")}
            />
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      )}
    </div>
  );
}
