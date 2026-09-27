import { z } from "zod";

import { en } from "@/lib/i18n/en";
import { createProfileFormSchema, createProfileRequestSchema } from "@/lib/i18n/schemas";

export const profileFormSchema = createProfileFormSchema(en.validation);
export const profileRequestSchema = createProfileRequestSchema(en.validation);

export const profileResponseSchema = z.object({
  displayName: z.string(),
  bio: z.string(),
  persisted: z.boolean(),
});

export type TProfileValues = z.infer<typeof profileFormSchema>;
export type TProfile = z.infer<typeof profileResponseSchema>;
