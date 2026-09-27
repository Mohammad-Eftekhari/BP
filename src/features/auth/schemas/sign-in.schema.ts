import { en } from "@/lib/i18n/en";
import { createEmailSchema, createPasswordSchema, createSignInSchema } from "@/lib/i18n/schemas";

export const emailSchema = createEmailSchema(en.validation);
export const passwordSchema = createPasswordSchema(en.validation);
export const signInSchema = createSignInSchema(en.validation);

export type TSignInValues = {
  email: string;
  password: string;
};
