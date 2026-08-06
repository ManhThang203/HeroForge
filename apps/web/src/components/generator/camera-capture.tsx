"use client";

import { Camera, X } from "lucide-react";
import { Button } from "@/components/shared/button";
import { useCamera } from "@/hooks/use-camera";

type CameraCaptureProps = {
  onCapture: (blob: Blob) => void;
};

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const { videoRef, isOpen, isReady, start, stop, capture } = useCamera();

  /** Chụp ảnh từ camera và trả blob cho form. */
  async function handleCapture() {
    const blob = await capture();
    if (blob) onCapture(blob);
  }

  if (!isOpen) {
    return (
      <Button variant="secondary" onClick={() => void start()} type="button">
        <Camera className="size-4" aria-hidden />
        Use camera
      </Button>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
      <div className="relative overflow-hidden rounded-xl bg-[var(--background)] aspect-square">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="size-full object-cover"
          aria-label="Camera preview"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => void handleCapture()}
          disabled={!isReady}
          type="button"
        >
          <Camera className="size-4" aria-hidden />
          Capture
        </Button>
        <Button variant="ghost" onClick={stop} type="button" aria-label="Close camera">
          <X className="size-4" aria-hidden />
          Cancel
        </Button>
      </div>
    </div>
  );
}
