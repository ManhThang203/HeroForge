import type { Request, Response } from "express";
import { AppError } from "../lib/app-error.js";
import { sendSuccess } from "../lib/api-response.js";
import {
  toGenerationLogDto,
  toGenerationLogListDto,
} from "../lib/generation-log.mapper.js";
import { fetchLogById, fetchLogs } from "../services/generate.service.js";
import type {
  ListLogsQuery,
  LogIdParams,
} from "../validators/generate.schema.js";

type ListLogsRequest = Request & {
  query: ListLogsQuery;
};

type LogByIdRequest = Request & {
  params: LogIdParams;
};

/** Trả danh sách log generation mới nhất. */
export async function list(req: ListLogsRequest, res: Response): Promise<void> {
  const logs = await fetchLogs(req.query.limit);
  sendSuccess(res, { logs: toGenerationLogListDto(logs) });
}

/** Trả chi tiết một log theo id. */
export async function getById(req: LogByIdRequest, res: Response): Promise<void> {
  const log = await fetchLogById(req.params.id);

  if (!log) {
    throw new AppError("Log not found", 404);
  }

  sendSuccess(res, { log: toGenerationLogDto(log) });
}
