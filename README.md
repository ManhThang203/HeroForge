# HeroForge — Superhero Generator

Monorepo: **Next.js 16** frontend + **Express MVC** backend. Upload/capture a portrait, generate a cinematic superhero (identity-preserving) via Vercel AI Gateway (`bfl/flux-kontext-pro`), watermark the hero name with Sharp, and inspect request logs in a live Log Viewer.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, next-themes, Sonner, Lucide, Radix Collapsible |
| Backend | Express + TypeScript (MVC), Zod, Swagger |
| Database | Prisma 7 + MySQL |
| AI | Vercel AI Gateway + `bfl/flux-kontext-pro` (~$0.04/image) |
| Media | Cloudinary (upload/result) + Sharp (watermark) |

## Prerequisites

- Node.js >= 20
- pnpm
- MySQL 8+ (local, port `3306`)
- Vercel AI Gateway API key
- Cloudinary account (free tier)

## Setup

```bash
pnpm install
```

### Backend env

```bash
cp apps/server/.env.example apps/server/.env
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
NODE_ENV=development
```

> If the MySQL password contains `@`, URL-encode it as `%40`  
> Example: password `Th@ng112003` → `mysql://root:Th%40ng112003@localhost:3306/heroforge`

Create the database (e.g. `heroforge`), then migrate:

```bash
pnpm --filter @heroforge/server prisma:migrate
```

### Frontend env

```bash
cp apps/web/.env.example apps/web/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Run locally

Both apps:

```bash
pnpm dev
```

Or separately:

```bash
pnpm dev:server   # http://localhost:4000  — Swagger: /api/docs
pnpm dev:web      # http://localhost:3000
```

## Flow A–D (product checklist)

| Step | What to do | Expected |
|------|------------|----------|
| **A — Input** | Open `http://localhost:3000`, enter a hero name, upload a portrait **or** use camera capture | Preview shows; camera deny shows a Sonner toast |
| **B — Generate** | Click **Generate superhero** | Loading skeleton ~30–90s; BE uploads → AI → watermark → Cloudinary |
| **C — Result** | View watermarked image | Download button opens/saves result URL |
| **D — Logs** | Scroll to **Log viewer** | New row with status, latency, expandable payload/response; polls every 2s while generating |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/generate` | Generate superhero (multipart: `name`, `image`) |
| GET | `/api/logs` | List generation logs (`?limit=50`) |
| GET | `/api/logs/:id` | Log detail |
| GET | `/api/docs` | Swagger UI |

### curl examples

```bash
curl http://localhost:4000/api/health

curl -X POST http://localhost:4000/api/generate \
  -F "name=Tony Stark" \
  -F "image=@./sample.jpg"

curl "http://localhost:4000/api/logs?limit=10"
```

## Tests

```bash
pnpm test:server
```

Smoke tests do **not** call AI Gateway or Cloudinary.

## Project structure

```
HeroForge/
  apps/
    server/                 # Express MVC API
      prisma/
      src/
        routes/ controllers/ services/ models/
        config/ middleware/ validators/
    web/                    # Next.js UI
      src/
        app/                # layout, page, providers, globals
        components/
          generator/        # form, camera, result, logs
          shared/           # button, input, badge, theme toggle
        hooks/ lib/ types/
  .env.example
  package.json
  pnpm-workspace.yaml
```

## Deploy bonus (optional)

### Backend → Render

1. Create a **Web Service** from this repo; root/start command scoped to `apps/server`.
2. Build: `pnpm install && pnpm --filter @heroforge/server build`
3. Start: `pnpm --filter @heroforge/server start`
4. Set env vars from `apps/server/.env` (use a hosted MySQL or keep Neon if you migrate later).
5. Run `pnpm --filter @heroforge/server prisma:migrate:deploy` against the production DB.
6. Set `CORS_ORIGIN` to your Vercel FE URL.

### Frontend → Vercel

1. Import the repo; set **Root Directory** to `apps/web`.
2. Framework: Next.js (auto).
3. Env: `NEXT_PUBLIC_API_URL=https://your-render-api.onrender.com`
4. Deploy → open the live URL and verify flow A–D.

### Notes

- Camera requires **HTTPS** in production (localhost is fine for local testing).
- Each generate costs ~$0.04 on Flux Kontext Pro — avoid spam retries on the free credit.
- Prefer portrait photos with a clear face for identity preservation.

## BE gate (already implemented)

- [x] `GET /api/health` → 200
- [x] `GET /api/docs` → Swagger UI
- [x] `POST /api/generate` → `resultImageUrl` + log
- [x] `GET /api/logs` → payload, latency, status
- [x] `pnpm test:server` passes
