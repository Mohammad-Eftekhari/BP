import "server-only";

import { ZodError } from "zod";

import { logger } from "@/lib/logger/logger";

import {
  AppError,
  ERROR_STATUS,
  fieldErrorsFromZod,
  type TApiErrorBody,
  type TApiSuccessBody,
  type TErrorCode,
} from "./errors";

export function jsonSuccess<TData>(data: TData, status = 200): Response {
  const body: TApiSuccessBody<TData> = { success: true, data };
  return Response.json(body, { status });
}

export function jsonError(code: TErrorCode, message: string, details?: unknown): Response {
  const body: TApiErrorBody = {
    success: false,
    error: details === undefined ? { code, message } : { code, message, details },
  };

  return Response.json(body, { status: ERROR_STATUS[code] });
}

export function toErrorResponse(error: unknown): Response {
  if (error instanceof AppError) {
    return jsonError(error.code, error.message, error.details);
  }

  if (error instanceof ZodError) {
    return jsonError("VALIDATION_ERROR", "Request validation failed", fieldErrorsFromZod(error));
  }

  logger.error("Unhandled server error", {
    name: error instanceof Error ? error.name : "UnknownError",
    message: error instanceof Error ? error.message : "Unknown error",
  });

  return jsonError("INTERNAL_ERROR", "Something went wrong");
}

export async function handleRoute(handler: () => Promise<Response>): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    return toErrorResponse(error);
  }
}
