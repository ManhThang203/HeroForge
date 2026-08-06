import type {
  ApiError,
  ApiSuccess,
  GenerateResult,
  GenerationLog,
} from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/** Parse JSON response envelope từ BE; throw Error với message thân thiện. */
async function parseEnvelope<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiSuccess<T> | ApiError;

  if (!res.ok || !json.success) {
    const message =
      !json.success && json.message
        ? json.message
        : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return json.data;
}

/** Health check API. */
export async function fetchHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_URL}/api/health`, { cache: "no-store" });
  return parseEnvelope(res);
}

/** Gửi name + ảnh multipart để generate superhero. */
export async function generateSuperhero(
  name: string,
  image: Blob,
  filename = "upload.jpg",
): Promise<GenerateResult> {
  const form = new FormData();
  form.append("name", name);
  form.append("image", image, filename);

  const res = await fetch(`${API_URL}/api/generate`, {
    method: "POST",
    body: form,
  });

  return parseEnvelope(res);
}

/** Lấy danh sách generation logs. */
export async function fetchLogs(limit = 50): Promise<GenerationLog[]> {
  const res = await fetch(`${API_URL}/api/logs?limit=${limit}`, {
    cache: "no-store",
  });
  const data = await parseEnvelope<{ logs: GenerationLog[] }>(res);
  return data.logs;
}
