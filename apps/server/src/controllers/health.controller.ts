import type { Request, Response } from "express";
import { sendSuccess } from "../lib/api-response.js";

/** Kiểm tra server đang chạy. */
export function check(_req: Request, res: Response): void {
  sendSuccess(res, {
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
