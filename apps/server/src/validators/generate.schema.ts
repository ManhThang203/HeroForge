import { z } from "zod";

export const generateBodySchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
});

export const listLogsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const logIdParamsSchema = z.object({
  id: z.string().min(1, "Log id is required"),
});

export type GenerateBody = z.infer<typeof generateBodySchema>;
export type ListLogsQuery = z.infer<typeof listLogsQuerySchema>;
export type LogIdParams = z.infer<typeof logIdParamsSchema>;
