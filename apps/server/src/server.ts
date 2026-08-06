import "./config/load-dotenv.js";
import { createApp } from "./app.js";
import { loadEnv } from "./config/env.js";

/** Entry point khởi động HTTP server. */
async function main() {
  const env = loadEnv();
  const app = createApp(env);

  app.listen(env.PORT, () => {
    console.log(`HeroForge API running on http://localhost:${env.PORT}`);
    console.log(`Swagger UI: http://localhost:${env.PORT}/api/docs`);
  });
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
