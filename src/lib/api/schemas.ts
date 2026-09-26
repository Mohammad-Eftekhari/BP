import { z } from "zod";

export const currentUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
});

export type TCurrentUser = z.infer<typeof currentUserSchema>;

export const healthSchema = z.object({
  status: z.literal("ok"),
  database: z.literal("up"),
});

export type THealth = z.infer<typeof healthSchema>;
