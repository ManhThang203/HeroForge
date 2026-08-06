export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: unknown;
};

export type GenerateResult = {
  logId: string;
  resultImageUrl: string;
  sourceImageUrl: string;
  latencyMs: number;
};

export type GenerationLog = {
  id: string;
  createdAt: string;
  finishedAt: string | null;
  name: string;
  sourceImageUrl: string | null;
  resultImageUrl: string | null;
  prompt: string;
  model: string;
  requestPayload: unknown;
  httpStatus: number | null;
  responseSummary: unknown;
  latencyMs: number | null;
  status: string;
  errorMessage: string | null;
};
