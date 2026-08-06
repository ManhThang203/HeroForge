import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

type RequestSource = "body" | "query" | "params";

/** Factory middleware validate request bằng Zod schema. */
export function validateRequest<T>(
  schema: ZodSchema<T>,
  source: RequestSource = "body",
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req[source]);

    if (!parsed.success) {
      next(parsed.error);
      return;
    }

    req[source] = parsed.data as never;
    next();
  };
}
