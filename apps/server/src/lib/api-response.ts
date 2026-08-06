import type { Response } from "express";

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: unknown;
};

/** Trả response thành công theo envelope chuẩn. */
export function sendSuccess<T>(
  res: Response,
  data: T,
  status = 200,
): Response {
  return res.status(status).json({ success: true, data } satisfies ApiSuccess<T>);
}

/** Trả response lỗi theo envelope chuẩn. */
export function sendError(
  res: Response,
  message: string,
  status = 400,
  errors?: unknown,
): Response {
  return res.status(status).json({
    success: false,
    message,
    ...(errors !== undefined ? { errors } : {}),
  } satisfies ApiError);
}
