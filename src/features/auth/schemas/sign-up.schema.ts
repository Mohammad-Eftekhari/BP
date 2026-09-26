import { z } from "zod";

import { emailSchema, passwordSchema } from "./sign-in.schema";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(80, "Name must be at most 80 characters"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type TSignUpValues = z.infer<typeof signUpSchema>;
