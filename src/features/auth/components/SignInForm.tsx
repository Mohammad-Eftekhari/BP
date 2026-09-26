"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EAppRoutes } from "@/constants/routes";
import { signInSchema, type TSignInValues } from "@/features/auth/schemas/sign-in.schema";
import { authClient } from "@/lib/auth/auth-client";
import { getSafeNextPath } from "@/utils/get-safe-next-path";

type TSignInFormProps = {
  nextPath?: string | null;
};

export function SignInForm({ nextPath }: TSignInFormProps) {
  const router = useRouter();
  const form = useForm<TSignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: TSignInValues) {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      form.setError("root", {
        message:
          error.status === 429
            ? "Too many attempts. Wait a moment and try again."
            : "Email or password is incorrect.",
      });
      return;
    }

    router.push(getSafeNextPath(nextPath, EAppRoutes.dashboard));
    router.refresh();
  }

  const rootError = form.formState.errors.root?.message;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
              <Input
                {...field}
                id="sign-in-email"
                type="email"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
              <Input
                {...field}
                id="sign-in-password"
                type="password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        {rootError ? (
          <p role="alert" className="text-sm text-destructive">
            {rootError}
          </p>
        ) : null}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </FieldGroup>
    </form>
  );
}
