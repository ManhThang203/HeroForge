import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import type { Env } from "./config/env.js";
import { createSwaggerSpec } from "./config/swagger.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { createApiRouter } from "./routes/index.js";
import { initCloudinary } from "./services/cloudinary.service.js";

/** Tạo và cấu hình Express app. */
export function createApp(env: Env) {
  initCloudinary(env);

  const app = express();
  const swaggerSpec = createSwaggerSpec(env);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
  app.use(express.json({ limit: "1mb" }));

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/api", createApiRouter(env));

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  app.use(errorMiddleware);

  return app;
}
