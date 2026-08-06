"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { generateSuperhero } from "@/lib/api";
import type { GenerateResult } from "@/types/api";

type UseGenerateOptions = {
  onSuccess?: (result: GenerateResult) => void;
};

/** Quản lý state và gọi POST /api/generate. */
export function useGenerate(options: UseGenerateOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);

  const generate = useCallback(
    async (name: string, image: Blob, filename?: string) => {
      const trimmed = name.trim();
      if (!trimmed) {
        toast.error("Please enter a hero name");
        return;
      }
      if (!image) {
        toast.error("Please upload or capture a photo");
        return;
      }

      setIsGenerating(true);
      try {
        const data = await generateSuperhero(trimmed, image, filename);
        setResult(data);
        options.onSuccess?.(data);
        toast.success("Superhero ready!");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Generation failed";
        toast.error(message);
      } finally {
        setIsGenerating(false);
      }
    },
    [options],
  );

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { isGenerating, result, generate, reset, setResult };
}
