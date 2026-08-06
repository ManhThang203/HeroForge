# HeroForge — Superhero Generator

Monorepo backend-first: Express MVC API for superhero image generation via Vercel AI Gateway.

> **Status:** Backend complete. Frontend (`apps/web`) not started yet.

## Stack (Backend)

- Express + TypeScript (MVC)
- Prisma + MySQL (local / Navicat)
- Vercel AI Gateway + `bfl/flux-kontext-pro`
- Cloudinary (image storage)
- Sharp (name watermark)
- Swagger UI (`/api/docs`)
- Vitest + Supertest

## Prerequisites

- Node.js >= 20
- pnpm
- MySQL 8+ (e.g. `MYSQL80` service on Windows, port `3306`)
- Vercel AI Gateway API key
- Cloudinary account (free tier)

## Setup

```bash
pnpm install
```

Copy env and fill values:

```bash
cp .env.example apps/server/.env
```

Edit `apps/server/.env`:

```env
DATABASE_URL=mysql://root:password@localhost:3306/heroforge
AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

Create database in Navicat/MySQL (e.g. `heroforge`), then run migrations:

```bash
pnpm --filter @heroforge/server prisma:migrate
```

Start API:

```bash
pnpm dev:server
```

- API: `http://localhost:4000`
- Swagger: `http://localhost:4000/api/docs`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/generate` | Generate superhero (multipart: `name`, `image`) |
| GET | `/api/logs` | List generation logs (`?limit=50`) |
| GET | `/api/logs/:id` | Log detail |
| GET | `/api/docs` | Swagger UI |

## Test with curl

Health:

```bash
curl http://localhost:4000/api/health
```

Generate (requires real keys + sample image):

```bash
curl -X POST http://localhost:4000/api/generate \
  -F "name=Tony Stark" \
  -F "image=@./sample.jpg"
```

List logs:

```bash
curl "http://localhost:4000/api/logs?limit=10"
```

## Run tests

```bash
pnpm test:server
```

Smoke tests do **not** call AI Gateway or Cloudinary.

## Project structure

```
apps/server/
  prisma/schema.prisma
  src/
    routes/        # URL mapping
    controllers/   # HTTP layer
    services/      # Business logic
    models/        # Prisma access
    config/        # env, swagger, prompts
    middleware/
    validators/
```

## BE gate checklist (before FE)

- [ ] `GET /api/health` → 200
- [ ] `GET /api/docs` → Swagger UI loads
- [ ] `POST /api/generate` with image → returns `resultImageUrl` + log
- [ ] `GET /api/logs` → shows request payload, latency, status
- [ ] `pnpm test:server` passes

## Frontend

`apps/web` (Next.js 16) — **not implemented yet**. Will be added after BE gate passes.
