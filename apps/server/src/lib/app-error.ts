export class AppError extends Error {
  readonly statusCode: number;
  readonly errors?: unknown;
  readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 400,
    errors?: unknown,
    isOperational = true,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
  }
}

/** Bọc async handler để forward lỗi sang error middleware. */
export function asyncHandler<T extends (...args: never[]) => Promise<unknown>>(
  fn: T,
) {
  return (...args: Parameters<T>) => {
    const result = fn(...args);
    return Promise.resolve(result).catch(args[2]);
  };
}
