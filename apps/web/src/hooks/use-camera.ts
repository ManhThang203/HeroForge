"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/** Quản lý getUserMedia, capture canvas → blob, cleanup tracks. */
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  /** Dừng toàn bộ track camera. */
  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsReady(false);
    setIsOpen(false);
  }, []);

  /** Xin quyền camera và gắn stream vào video element. */
  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Camera is not supported in this browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setIsOpen(true);

      requestAnimationFrame(() => {
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        void video.play().then(() => setIsReady(true));
      });
    } catch {
      toast.error("Camera permission denied or no device found");
      stop();
    }
  }, [stop]);

  /** Chụp frame hiện tại thành JPEG blob. */
  const capture = useCallback(async (): Promise<Blob | null> => {
    const video = videoRef.current;
    if (!video || !isReady) {
      toast.error("Camera is not ready");
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            toast.error("Failed to capture photo");
            resolve(null);
            return;
          }
          resolve(blob);
          stop();
        },
        "image/jpeg",
        0.92,
      );
    });
  }, [isReady, stop]);

  useEffect(() => () => stop(), [stop]);

  return { videoRef, isOpen, isReady, start, stop, capture };
}
