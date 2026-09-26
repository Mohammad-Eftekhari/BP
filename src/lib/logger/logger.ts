import "server-only";

const REDACTED_KEYS = new Set([
  "password",
  "token",
  "secret",
  "authorization",
  "cookie",
  "set-cookie",
  "email",
]);

function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => sanitize(entry));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      REDACTED_KEYS.has(key.toLowerCase()) ? "[redacted]" : sanitize(entry),
    ]),
  );
}

function write(level: "info" | "error", message: string, context?: Record<string, unknown>) {
  const payload = {
    level,
    message,
    ...(context ? (sanitize(context) as Record<string, unknown>) : {}),
  };
  const line = JSON.stringify(payload);

  if (level === "error") {
    console.error(line);
    return;
  }

  console.info(line);
}

export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    write("info", message, context);
  },
  error(message: string, context?: Record<string, unknown>) {
    write("error", message, context);
  },
};
