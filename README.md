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
| **C — Result** | View watermarked image | Download button saves the image to your device |
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
  render.yaml               # Render Blueprint (BE)
  package.json
  pnpm-workspace.yaml
```

## Deploy (ý tưởng 1 — bạn bấm Deploy trên web)

Agent/repo đã chuẩn bị sẵn [`render.yaml`](render.yaml) + [`apps/web/vercel.json`](apps/web/vercel.json).  
**Bạn** tự tạo MySQL cloud, migrate, rồi Deploy trên Render + Vercel (không cần đưa API token cho AI).

```
Browser → Vercel (FE) → Render (API) → MySQL cloud + Cloudinary + AI Gateway
```

**Thứ tự bắt buộc:** Bước 0 → 1 → 2 → 3 → 4.

---

### Bước 0 — MySQL cloud + migrate

Local MySQL **không** dùng được khi API chạy trên Render. Cần MySQL public (ví dụ [Railway](https://railway.app)).

1. Railway → **New Project** → **Provision MySQL**.
2. Click service **MySQL** → tab **Variables** hoặc **Connect**.
3. **Quan trọng — chọn đúng URL public (TCP Proxy), không dùng URL internal:**

   | Dùng khi | Host trong URL | Ai kết nối được |
   |----------|----------------|-----------------|
   | Migrate từ máy bạn / Navicat / Render bên ngoài | `*.proxy.rlwy.net` hoặc host **public** | Máy local + service ngoài Railway |
   | Chỉ service **trong cùng** project Railway | `mysql.railway.internal` | **Không** dùng từ laptop → lỗi `P1001` |

   Trên Railway: **Connect** → chọn **Public URL** / **TCP Proxy** (hoặc biến kiểu `MYSQL_PUBLIC_URL` / `DATABASE_PUBLIC_URL` nếu có).  
   Host phải **không** chứa `.railway.internal`.

4. Ghép (hoặc copy public URL sẵn):
   ```env
   DATABASE_URL=mysql://USER:PASSWORD@HOST_PUBLIC:PORT_PUBLIC/DATABASE
   ```
   Password có `@` → `%40`. Port public thường **không** phải `3306` (Railway gán port proxy riêng).
5. Mở [`apps/server/.env`](apps/server/.env):
   - **Backup** dòng `DATABASE_URL` local.
   - Thay tạm bằng URL **public** cloud.
6. Chạy migrate:
   ```bash
   pnpm --filter @heroforge/server prisma:migrate:deploy
   ```
7. Kiểm tra (Navicat với host public): có bảng `generation_logs` và `_prisma_migrations`.
8. Đổi lại `DATABASE_URL` local nếu vẫn muốn `pnpm dev:server` ở nhà.  
   URL cloud (public) sẽ dán lại vào **Render Environment** ở Bước 1.

---

### Bước 1 — Backend trên Render

1. Push code (kèm `render.yaml`) lên GitHub.
2. [render.com](https://render.com) → **New +** → **Web Service** → chọn repo HeroForge.
3. Cấu hình (hoặc dùng Blueprint từ `render.yaml`):

| Field | Value |
|-------|--------|
| Name | `heroforge-api` |
| Root Directory | *(để trống)* |
| Runtime | Node |
| Build Command | `npm install -g pnpm@9 && pnpm install --prod=false && pnpm --filter @heroforge/server build` |
| Start Command | `pnpm --filter @heroforge/server start` |
| Instance | Free |

> **Không** dùng `corepack enable` trên Render — sẽ lỗi `EROFS: read-only file system` khi ghi `/usr/bin/pnpm`.  
> Dùng `pnpm install --prod=false` để lúc build vẫn có đủ tool (tránh `prisma: not found` / `tsc: not found` khi `NODE_ENV=production`).

4. **Environment** (điền giá trị thật, không commit):

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `NODE_VERSION` | `20` |
| `PORT` | `4000` |
| `DATABASE_URL` | MySQL **public** URL (`*.proxy.rlwy.net`, không dùng `.internal`) |
| `AI_GATEWAY_API_KEY` | key Vercel AI Gateway |
| `CLOUDINARY_CLOUD_NAME` | … |
| `CLOUDINARY_API_KEY` | … |
| `CLOUDINARY_API_SECRET` | … |
| `CORS_ORIGIN` | tạm `http://localhost:3000` — **đổi ở Bước 3** |

5. **Create Web Service** → đợi Deploy xanh.
6. Copy URL API, ví dụ `https://heroforge-api.onrender.com`.
7. Test:
   ```bash
   curl https://YOUR-API.onrender.com/api/health
   ```
   Kỳ vọng: `"success": true`. Swagger: `/api/docs`.

> Free tier: service có thể **sleep** — request đầu chậm 30–60s.

---

### Bước 2 — Frontend trên Vercel

1. [vercel.com](https://vercel.com) → **Add New…** → **Project** → Import repo HeroForge.
2. Cấu hình:

| Field | Value |
|-------|--------|
| Framework | Next.js |
| **Root Directory** | `apps/web` ← bắt buộc |
| Install / Build | theo [`apps/web/vercel.json`](apps/web/vercel.json) (hoặc default) |

3. **Environment Variables**:

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-API.onrender.com` (không có `/` cuối) |

   Không đưa AI/Cloudinary secrets lên Vercel.

4. **Deploy** → copy URL FE, ví dụ `https://heroforge.vercel.app`.

---

### Bước 3 — Nối CORS

1. Render → Web Service → **Environment**.
2. Sửa:
   ```env
   CORS_ORIGIN=https://heroforge.vercel.app
   ```
3. **Manual Deploy** / Save để BE restart.
4. Không làm bước này → browser báo lỗi CORS khi FE gọi API.

---

### Bước 4 — Checklist live (A–D) + troubleshooting

| # | Check | Kỳ vọng |
|---|--------|---------|
| 1 | `GET {API}/api/health` | 200 |
| 2 | Mở FE Vercel | UI HeroForge |
| 3 | Name + ảnh → Generate | Ảnh watermark |
| 4 | Download | File tải về máy |
| 5 | Log Viewer | Log mới (status/latency) |
| 6 | Camera | Xin quyền OK (HTTPS) |

| Lỗi | Nguyên nhân | Xử lý |
|-----|-------------|--------|
| Build `EROFS` / `unlink '/usr/bin/pnpm'` | Dùng `corepack enable` trên Render | Đổi Build Command sang `npm install -g pnpm@9 && …` (xem bảng trên) |
| Build `prisma: not found` / `tsc: not found` | `pnpm install` bỏ `devDependencies` khi `NODE_ENV=production` | Dùng `pnpm install --prod=false`; repo đã chuyển `prisma` + `typescript` sang `dependencies` |
| CORS trên FE | Sai `CORS_ORIGIN` | Đúng URL Vercel `https://…`, không slash cuối; redeploy BE |
| `Failed to fetch` | Sai `NEXT_PUBLIC_API_URL` / BE sleep | Kiểm tra health; đợi wake-up; redeploy FE sau khi sửa env |
| BE crash lúc start | Thiếu env / sai `DATABASE_URL` | Xem Render **Logs** |
| Prisma / table missing | Chưa migrate cloud | Chạy lại Bước 0 |
| Generate 502 | Cloudinary/AI key hoặc quota | Kiểm tra keys + `GET /api/logs` |

**Notes:** Camera cần HTTPS (Vercel OK). Mỗi gen ~$0.04. Ảnh chân dung rõ mặt cho identity tốt hơn.

---

### Checklist bàn giao (việc **bạn** làm)

Sau khi pull/push các file deploy config từ repo:

- [ ] Push `main` (hoặc nhánh deploy) lên GitHub có `render.yaml` + `apps/web/vercel.json`
- [ ] Tạo MySQL cloud (Railway/…) và có `DATABASE_URL`
- [ ] Chạy `pnpm --filter @heroforge/server prisma:migrate:deploy` với URL cloud
- [ ] Deploy BE trên Render + điền đủ env + `/api/health` OK
- [ ] Deploy FE trên Vercel (Root = `apps/web`) + `NEXT_PUBLIC_API_URL`
- [ ] Đặt `CORS_ORIGIN` = URL Vercel production trên Render
- [ ] Verify flow A–D trên URL live
- [ ] **Không** commit `apps/server/.env` / `apps/web/.env.local`

## BE gate (already implemented)

- [x] `GET /api/health` → 200
- [x] `GET /api/docs` → Swagger UI
- [x] `POST /api/generate` → `resultImageUrl` + log
- [x] `GET /api/logs` → payload, latency, status
- [x] `pnpm test:server` passes
