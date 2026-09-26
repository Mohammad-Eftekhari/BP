import { ZodError } from "zod";

export const ERROR_STATUS = {
  VALIDATION_ERROR: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  BUSINESS_RULE: 422,
  RATE_LIMITED: 429,
  SERVICE_UNAVAILABLE: 503,
  INTERNAL_ERROR: 500,
} as const;

export type TErrorCode = keyof typeof ERROR_STATUS;

export type TFieldError = {
  field: string;
  message: string;
};

export type TApiErrorBody = {
  success: false;
  error: {
    code: TErrorCode;
    message: string;
    details?: unknown;
  };
};

export type TApiSuccessBody<TData> = {
  success: true;
  data: TData;
};

export class AppError extends Error {
  readonly code: TErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: TErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = ERROR_STATUS[code];
    this.details = details;
  }
}

export function fieldErrorsFromZod(error: ZodError): TFieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "root",
    message: issue.message,
  }));
}
