import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ZodError } from "zod";
import { AppError } from "../lib/app-error.js";
import { sendError } from "../lib/api-response.js";

/** Middleware xử lý lỗi tập trung cho toàn bộ API. */
export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  if (err instanceof ZodError) {
    sendError(res, "Validation failed", 400, err.flatten());
    return;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      sendError(res, "File too large. Maximum size is 5MB", 400);
      return;
    }

    sendError(res, err.message, 400);
    return;
  }

  console.error("[error]", err);

  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err instanceof Error
        ? err.message
        : "Internal server error";

  sendError(res, message, 500);
}
