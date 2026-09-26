import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  BETTER_AUTH_TRUSTED_ORIGINS: z.string().optional(),
});

export type TServerEnv = z.infer<typeof serverEnvSchema> & {
  trustedOrigins: string[];
};

let cachedEnv: TServerEnv | undefined;

export function getServerEnv(): TServerEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid server environment variables.\n${details}`);
  }

  const trustedOrigins = new Set<string>([parsed.data.BETTER_AUTH_URL]);

  for (const origin of parsed.data.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? []) {
    const trimmed = origin.trim();
    if (trimmed) {
      trustedOrigins.add(trimmed);
    }
  }

  cachedEnv = {
    ...parsed.data,
    trustedOrigins: [...trustedOrigins],
  };

  return cachedEnv;
}
