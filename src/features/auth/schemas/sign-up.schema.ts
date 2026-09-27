import { en } from "@/lib/i18n/en";
import { createSignUpSchema } from "@/lib/i18n/schemas";

export const signUpSchema = createSignUpSchema(en.validation);

export type TSignUpValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
