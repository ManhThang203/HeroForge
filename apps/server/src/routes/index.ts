import { Router } from "express";
import { createGenerateRouter } from "./generate.routes.js";
import healthRoutes from "./health.routes.js";
import logsRoutes from "./logs.routes.js";
import type { Env } from "../config/env.js";

/** Gom tất cả API routes dưới prefix /api. */
export function createApiRouter(env: Env): Router {
  const router = Router();

  router.use(healthRoutes);
  router.use(createGenerateRouter(env));
  router.use(logsRoutes);

  return router;
}
