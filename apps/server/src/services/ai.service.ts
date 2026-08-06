import { createGatewayProvider } from "@ai-sdk/gateway";
import { generateImage } from "ai";
import type { Env } from "../config/env.js";
import { IMAGE_MODEL, SUPERHERO_PROMPT } from "../config/prompts.js";
import { AppError } from "../lib/app-error.js";

type GenerateSuperheroInput = {
  sourceImageUrl: string;
};

type GenerateSuperheroResult = {
  imageBuffer: Buffer;
  model: string;
  prompt: string;
  requestPayload: Record<string, unknown>;
  responseSummary: Record<string, unknown>;
};

/** Gọi Vercel AI Gateway (Flux Kontext Pro) để biến ảnh thành siêu anh hùng. */
export async function generateSuperheroImage(
  env: Env,
  input: GenerateSuperheroInput,
): Promise<GenerateSuperheroResult> {
  const gateway = createGatewayProvider({ apiKey: env.AI_GATEWAY_API_KEY });

  const requestPayload = {
    model: IMAGE_MODEL,
    prompt: SUPERHERO_PROMPT,
    sourceImageUrl: input.sourceImageUrl,
    aspectRatio: "1:1",
  };

  try {
    const result = await generateImage({
      model: gateway.imageModel(IMAGE_MODEL),
      prompt: {
        text: SUPERHERO_PROMPT,
        images: [input.sourceImageUrl],
      },
      aspectRatio: "1:1",
    });

    const imageBuffer = Buffer.from(result.image.uint8Array);

    return {
      imageBuffer,
      model: IMAGE_MODEL,
      prompt: SUPERHERO_PROMPT,
      requestPayload,
      responseSummary: {
        provider: "vercel-ai-gateway",
        model: IMAGE_MODEL,
        imageCount: result.images.length,
      },
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Image generation failed";

    if (/429|rate limit|quota/i.test(message)) {
      throw new AppError("AI rate limit exceeded. Please try again later.", 429);
    }

    if (/timeout|timed out/i.test(message)) {
      throw new AppError("AI request timed out. Please try again.", 504);
    }

    throw new AppError(message, 502);
  }
}

export type { GenerateSuperheroResult };
