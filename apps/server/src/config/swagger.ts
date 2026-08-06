import swaggerJsdoc from "swagger-jsdoc";
import type { Env } from "./env.js";

/** Tạo OpenAPI spec cho Swagger UI. */
export function createSwaggerSpec(env: Env) {
  return swaggerJsdoc({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "HeroForge API",
        version: "1.0.0",
        description:
          "Superhero Generator — upload avatar, generate superhero image, view logs.",
      },
      servers: [
        {
          url: `http://localhost:${env.PORT}`,
          description: "Local development",
        },
      ],
      tags: [
        { name: "Health", description: "Health check" },
        { name: "Generate", description: "Superhero generation" },
        { name: "Logs", description: "Generation logs" },
      ],
    },
    apis: ["./src/routes/*.ts"],
  });
}
