import type { GenerationLog, Prisma } from "@prisma/client";
import { prisma } from "./prisma.js";

export type CreateGenerationLogInput = {
  name: string;
  prompt: string;
  model: string;
  requestPayload: Prisma.InputJsonValue;
};

export type UpdateGenerationLogInput = {
  finishedAt?: Date;
  sourceImageUrl?: string;
  resultImageUrl?: string;
  httpStatus?: number;
  responseSummary?: Prisma.InputJsonValue;
  latencyMs?: number;
  status?: string;
  errorMessage?: string | null;
};

/** Tạo bản ghi log ở trạng thái pending. */
export async function createGenerationLog(
  input: CreateGenerationLogInput,
): Promise<GenerationLog> {
  return prisma.generationLog.create({
    data: {
      name: input.name,
      prompt: input.prompt,
      model: input.model,
      requestPayload: input.requestPayload,
      status: "pending",
    },
  });
}

/** Cập nhật log sau khi xử lý xong hoặc lỗi. */
export async function updateGenerationLog(
  id: string,
  input: UpdateGenerationLogInput,
): Promise<GenerationLog> {
  return prisma.generationLog.update({
    where: { id },
    data: input,
  });
}

/** Lấy danh sách log mới nhất, phân trang theo limit. */
export async function listGenerationLogs(limit = 50): Promise<GenerationLog[]> {
  return prisma.generationLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/** Lấy chi tiết một log theo id. */
export async function getGenerationLogById(
  id: string,
): Promise<GenerationLog | null> {
  return prisma.generationLog.findUnique({ where: { id } });
}
