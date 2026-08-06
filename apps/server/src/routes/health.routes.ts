import { Router } from "express";
import { check } from "../controllers/health.controller.js";

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get("/health", check);

export default router;
