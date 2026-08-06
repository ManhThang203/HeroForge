import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const serverRoot = path.resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "../..",
);

const envPaths = [
  path.resolve(serverRoot, ".env"),
  path.resolve(serverRoot, "../../.env"),
];

/** Nạp .env trước mọi module đọc process.env (Prisma, loadEnv, …). */
for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    config({ path: envPath, override: true });
  }
}
