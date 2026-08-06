import type { Prisma } from "@prisma/client";
import type { Env } from "../config/env.js";
import { IMAGE_MODEL, SUPERHERO_PROMPT } from "../config/prompts.js";
import { AppError } from "../lib/app-error.js";
import {
  createGenerationLog,
  getGenerationLogById,
  listGenerationLogs,
  updateGenerationLog,
} from "../models/generation-log.model.js";
import { generateSuperheroImage } from "./ai.service.js";
import { uploadImageBuffer } from "./cloudinary.service.js";
import { applyNameWatermark } from "./watermark.service.js";

type GenerateInput = {
  name: string;
  imageBuffer: Buffer;
};

type GenerateResult = {
  logId: string;
  resultImageUrl: string;
  sourceImageUrl: string;
  latencyMs: number;
};

/** Orchestrate luồng generate: upload → AI → watermark → log. */
export async function runGeneration(
  env: Env,
  input: GenerateInput,
): Promise<GenerateResult> {
  const startedAt = Date.now();

  const log = await createGenerationLog({
    name: input.name,
    prompt: SUPERHERO_PROMPT,
    model: IMAGE_MODEL,
    requestPayload: {
      model: IMAGE_MODEL,
      prompt: SUPERHERO_PROMPT,
      aspectRatio: "1:1",
      name: input.name,
    },
  });

  try {
    const sourceImageUrl = await uploadImageBuffer(input.imageBuffer, {
      folder: "heroforge/uploads",
      publicId: `source-${log.id}`,
    });

    await updateGenerationLog(log.id, { sourceImageUrl });

    const aiResult = await generateSuperheroImage(env, { sourceImageUrl });

    const watermarkedBuffer = await applyNameWatermark(aiResult.imageBuffer, {
      name: input.name,
    });

    const resultImageUrl = await uploadImageBuffer(watermarkedBuffer, {
      folder: "heroforge/results",
      publicId: `result-${log.id}`,
    });

    const latencyMs = Date.now() - startedAt;

    await updateGenerationLog(log.id, {
      finishedAt: new Date(),
      resultImageUrl,
      httpStatus: 200,
      responseSummary: aiResult.responseSummary as Prisma.InputJsonValue,
      latencyMs,
      status: "success",
      errorMessage: null,
    });

    return {
      logId: log.id,
      resultImageUrl,
      sourceImageUrl,
      latencyMs,
    };
  } catch (error) {
    const latencyMs = Date.now() - startedAt;
    const message =
      error instanceof AppError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Generation failed";
    const httpStatus = error instanceof AppError ? error.statusCode : 500;

    await updateGenerationLog(log.id, {
      finishedAt: new Date(),
      httpStatus,
      latencyMs,
      status: "error",
      errorMessage: message,
      responseSummary: {
        error: message,
      },
    });

    throw error;
  }
}

/** Lấy danh sách log generation. */
export async function fetchLogs(limit: number) {
  return listGenerationLogs(limit);
}

/** Lấy chi tiết log theo id. */
export async function fetchLogById(id: string) {
  return getGenerationLogById(id);
}
