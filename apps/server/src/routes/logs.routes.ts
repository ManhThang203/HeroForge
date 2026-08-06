import { Router } from "express";
import * as logsController from "../controllers/logs.controller.js";
import { asyncHandler } from "../lib/app-error.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
  listLogsQuerySchema,
  logIdParamsSchema,
} from "../validators/generate.schema.js";

const router = Router();

/**
 * @openapi
 * /api/logs:
 *   get:
 *     tags: [Logs]
 *     summary: List generation logs
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Log list
 */
router.get(
  "/logs",
  validateRequest(listLogsQuerySchema, "query"),
  asyncHandler(logsController.list),
);

/**
 * @openapi
 * /api/logs/{id}:
 *   get:
 *     tags: [Logs]
 *     summary: Get log detail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Log detail
 *       404:
 *         description: Not found
 */
router.get(
  "/logs/:id",
  validateRequest(logIdParamsSchema, "params"),
  asyncHandler(logsController.getById),
);

export default router;
