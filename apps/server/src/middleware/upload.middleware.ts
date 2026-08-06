import multer from "multer";
import type { NextFunction, Request, Response } from "express";
import {
  ALLOWED_MIME_TYPES,
  MAX_UPLOAD_BYTES,
} from "../config/prompts.js";
import { AppError } from "../lib/app-error.js";

const storage = multer.memoryStorage();

/** Kiểm tra MIME type ảnh upload hợp lệ. */
function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void {
  if (
    !ALLOWED_MIME_TYPES.includes(
      file.mimetype as (typeof ALLOWED_MIME_TYPES)[number],
    )
  ) {
    cb(new AppError("Invalid file type. Allowed: JPEG, PNG, WebP", 400));
    return;
  }

  cb(null, true);
}

/** Multer instance lưu file vào memory buffer. */
export const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter,
});

/** Middleware bắt buộc phải có file ảnh trong field `image`. */
export function requireImageFile(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.file) {
    next(new AppError("Image file is required in field 'image'", 400));
    return;
  }

  next();
}
