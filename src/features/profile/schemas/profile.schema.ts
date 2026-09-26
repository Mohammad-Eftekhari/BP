import { z } from "zod";

const displayNameSchema = z
  .string()
  .trim()
  .min(1, "Display name is required")
  .max(80, "Display name must be at most 80 characters");

const bioSchema = z.string().trim().max(280, "Biography must be at most 280 characters");

export const profileFormSchema = z.object({
  displayName: displayNameSchema,
  bio: bioSchema,
});

export const profileRequestSchema = z.object({
  displayName: displayNameSchema,
  bio: bioSchema.optional().transform((value) => value ?? ""),
});

export const profileResponseSchema = z.object({
  displayName: z.string(),
  bio: z.string(),
  persisted: z.boolean(),
});

export type TProfileValues = z.infer<typeof profileFormSchema>;
export type TProfile = z.infer<typeof profileResponseSchema>;
