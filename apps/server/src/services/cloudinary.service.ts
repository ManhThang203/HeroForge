import { v2 as cloudinary } from "cloudinary";
import type { Env } from "../config/env.js";
import { AppError } from "../lib/app-error.js";

/** Khởi tạo Cloudinary SDK từ env. */
export function initCloudinary(env: Env): void {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

type UploadOptions = {
  folder: string;
  publicId?: string;
};

type CloudinaryUploadError = {
  message?: string;
  http_code?: number;
};

/** Map lỗi Cloudinary sang message dễ debug hơn cho client. */
function formatCloudinaryUploadError(error: CloudinaryUploadError): string {
  const detail = error.message ?? "Failed to upload image to Cloudinary";

  if (error.http_code === 403) {
    return `Cloudinary upload forbidden (403). API key thiếu quyền upload — vào Cloudinary Console → Settings → API Keys, gán role có quyền create/upload. Detail: ${detail}`;
  }

  return `Cloudinary upload failed: ${detail}`;
}

/** Upload buffer ảnh lên Cloudinary và trả secure URL. */
export async function uploadImageBuffer(
  buffer: Buffer,
  options: UploadOptions,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(
            new AppError(formatCloudinaryUploadError(error ?? {}), 502),
          );
          return;
        }

        resolve(result.secure_url);
      },
    );

    uploadStream.end(buffer);
  });
}
