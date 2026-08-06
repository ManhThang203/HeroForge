import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

const serverRoot = fileURLToPath(new URL(".", import.meta.url));

const envPaths = [
  path.resolve(serverRoot, ".env"),
  path.resolve(serverRoot, "../../.env"),
];

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    config({ path: envPath, override: true });
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
