import { z } from "zod";

import type { TApiErrorBody, TApiSuccessBody } from "./errors";

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const errorBodySchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

type TApiFetchOptions = RequestInit & {
  signal?: AbortSignal;
};

export async function apiFetch<TData>(
  path: string,
  schema: z.ZodType<TData>,
  options?: TApiFetchOptions,
): Promise<TData> {
  const headers = new Headers(options?.headers);

  if (options?.body !== undefined && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(path, {
    ...options,
    headers,
    credentials: "same-origin",
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsedError = errorBodySchema.safeParse(payload);
    if (parsedError.success) {
      throw new ApiClientError(
        response.status,
        parsedError.data.error.code,
        parsedError.data.error.message,
        parsedError.data.error.details,
      );
    }

    throw new ApiClientError(response.status, "INTERNAL_ERROR", "Request failed");
  }

  const successSchema: z.ZodType<TApiSuccessBody<TData>> = z.object({
    success: z.literal(true),
    data: schema,
  });
  const parsed = successSchema.safeParse(payload);

  if (!parsed.success) {
    throw new ApiClientError(
      response.status,
      "INTERNAL_ERROR",
      "Response did not match the expected shape",
    );
  }

  return parsed.data.data;
}

export function isApiErrorBody(value: unknown): value is TApiErrorBody {
  return errorBodySchema.safeParse(value).success;
}
