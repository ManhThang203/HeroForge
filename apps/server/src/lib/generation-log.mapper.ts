import type { GenerationLog } from "@prisma/client";

export type GenerationLogDto = {
  id: string;
  createdAt: string;
  finishedAt: string | null;
  name: string;
  sourceImageUrl: string | null;
  resultImageUrl: string | null;
  prompt: string;
  model: string;
  requestPayload: unknown;
  httpStatus: number | null;
  responseSummary: unknown;
  latencyMs: number | null;
  status: string;
  errorMessage: string | null;
};

/** Map bản ghi Prisma sang DTO trả về client. */
export function toGenerationLogDto(log: GenerationLog): GenerationLogDto {
  return {
    id: log.id,
    createdAt: log.createdAt.toISOString(),
    finishedAt: log.finishedAt?.toISOString() ?? null,
    name: log.name,
    sourceImageUrl: log.sourceImageUrl,
    resultImageUrl: log.resultImageUrl,
    prompt: log.prompt,
    model: log.model,
    requestPayload: log.requestPayload,
    httpStatus: log.httpStatus,
    responseSummary: log.responseSummary,
    latencyMs: log.latencyMs,
    status: log.status,
    errorMessage: log.errorMessage,
  };
}

/** Map danh sách log sang DTO. */
export function toGenerationLogListDto(logs: GenerationLog[]): GenerationLogDto[] {
  return logs.map(toGenerationLogDto);
}
