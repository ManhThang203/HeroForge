import { Router } from "express";
import type { Env } from "../config/env.js";
import { createGenerateController } from "../controllers/generate.controller.js";
import { asyncHandler } from "../lib/app-error.js";
import { requireImageFile, upload } from "../middleware/upload.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { generateBodySchema } from "../validators/generate.schema.js";

/** Đăng ký route generate superhero. */
export function createGenerateRouter(env: Env) {
  const router = Router();
  const create = createGenerateController(env);

  /**
   * @openapi
   * /api/generate:
   *   post:
   *     tags: [Generate]
   *     summary: Generate superhero image from avatar
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required: [name, image]
   *             properties:
   *               name:
   *                 type: string
   *                 example: Tony Stark
   *               image:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: Generated successfully
   *       400:
   *         description: Validation error
   *       502:
   *         description: AI or upload failure
   */
  router.post(
    "/generate",
    upload.single("image"),
    requireImageFile,
    validateRequest(generateBodySchema, "body"),
    asyncHandler(create),
  );

  return router;
}
