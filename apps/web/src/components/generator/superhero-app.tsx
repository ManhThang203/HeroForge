"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ImageSourcePicker } from "@/components/generator/image-source-picker";
import { GenerateResultPanel } from "@/components/generator/generate-result";
import { LogViewer } from "@/components/generator/log-viewer";
import { generateSuperhero } from "@/lib/api";
import type { GenerateResult } from "@/types/api";

export function SuperheroApp() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<Blob | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);

  /** Gửi name + ảnh lên API và cập nhật result panel. */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    setResult(null);

    try {
      const data = await generateSuperhero(
        trimmed,
        image,
        filename ?? "upload.jpg",
      );
      setResult(data);
      toast.success("Superhero ready!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Generation failed";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--accent)]">HeroForge</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Superhero Generator
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
            Upload or capture a portrait, add your hero name, and get a
            watermarked cinematic superhero image.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6"
        >
          <div>
            <h2 className="text-lg font-semibold">Create your hero</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Clear face photos work best. Generation takes about 30–90 seconds.
            </p>
          </div>

          <Input
            label="Hero name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tony Stark"
            maxLength={100}
            autoComplete="off"
            required
          />

          <ImageSourcePicker
            image={image}
            filename={filename}
            onChange={(nextImage, nextName) => {
              setImage(nextImage);
              setFilename(nextName);
            }}
          />

          <Button
            type="submit"
            disabled={isGenerating || !image || !name.trim()}
            className="w-full sm:w-auto"
          >
            <Sparkles className="size-4" aria-hidden />
            {isGenerating ? "Generating…" : "Generate superhero"}
          </Button>
        </form>

        <GenerateResultPanel
          result={result}
          isGenerating={isGenerating}
          onReset={() => setResult(null)}
        />
      </div>

      <LogViewer pollFast={isGenerating} />
    </div>
  );
}
