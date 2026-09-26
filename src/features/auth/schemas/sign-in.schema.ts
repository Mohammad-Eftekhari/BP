import { z } from "zod";

export const emailSchema = z.email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters");

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type TSignInValues = z.infer<typeof signInSchema>;
