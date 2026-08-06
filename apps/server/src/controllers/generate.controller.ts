import type { Request, Response } from "express";
import { sendSuccess } from "../lib/api-response.js";
import { runGeneration } from "../services/generate.service.js";
import type { Env } from "../config/env.js";
import type { GenerateBody } from "../validators/generate.schema.js";

type GenerateRequest = Request & {
  body: GenerateBody;
};

/** Nhận name + ảnh, chạy pipeline generate superhero. */
export function createGenerateController(env: Env) {
  return async (req: GenerateRequest, res: Response): Promise<void> => {
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        message: "Image file is required in field 'image'",
      });
      return;
    }

    const result = await runGeneration(env, {
      name: req.body.name,
      imageBuffer: file.buffer,
    });

    sendSuccess(res, result, 201);
  };
}
