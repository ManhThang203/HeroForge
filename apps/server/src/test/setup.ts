process.env.NODE_ENV = "test";
process.env.DATABASE_URL =
  process.env.DATABASE_URL ??
  "mysql://test:test@localhost:3306/heroforge_test";
process.env.AI_GATEWAY_API_KEY =
  process.env.AI_GATEWAY_API_KEY ?? "test-ai-gateway-key";
process.env.CLOUDINARY_CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME ?? "test-cloud";
process.env.CLOUDINARY_API_KEY =
  process.env.CLOUDINARY_API_KEY ?? "test-api-key";
process.env.CLOUDINARY_API_SECRET =
  process.env.CLOUDINARY_API_SECRET ?? "test-api-secret";
process.env.PORT = process.env.PORT ?? "4000";
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";
