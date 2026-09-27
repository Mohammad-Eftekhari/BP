"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EApiRoutes } from "@/constants/routes";
import { profileQueryKeys } from "@/features/profile/queries/profile-keys";
import {
  profileResponseSchema,
  type TProfile,
  type TProfileValues,
} from "@/features/profile/schemas/profile.schema";
import { ApiClientError, apiFetch } from "@/lib/api/client";
import type { TDictionary } from "@/lib/i18n/en";
import { createProfileFormSchema } from "@/lib/i18n/schemas";

type TProfileFormProps = {
  copy: TDictionary;
  initialProfile: TProfile;
};

export function ProfileForm({ copy, initialProfile }: TProfileFormProps) {
  const queryClient = useQueryClient();
  const schema = useMemo(() => createProfileFormSchema(copy.validation), [copy.validation]);
  const form = useForm<TProfileValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: initialProfile.displayName,
      bio: initialProfile.bio,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: TProfileValues) =>
      apiFetch(EApiRoutes.profile, profileResponseSchema, {
        method: "PUT",
        body: JSON.stringify(values),
      }),
    onSuccess: async (profile) => {
      queryClient.setQueryData(profileQueryKeys.current, profile);
      form.reset({ displayName: profile.displayName, bio: profile.bio });
      toast.success(copy.profile.saved);
    },
    onError: (error) => {
      const message = error instanceof ApiClientError ? error.message : copy.profile.saveError;
      form.setError("root", { message });
    },
  });

  const rootError = form.formState.errors.root?.message;
  const isSaving = form.formState.isSubmitting || mutation.isPending;

  return (
    <form onSubmit={form.handleSubmit((values) => mutation.mutateAsync(values))} noValidate>
      <FieldGroup>
        <Controller
          name="displayName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-display-name">{copy.profile.displayName}</FieldLabel>
              <Input
                {...field}
                id="profile-display-name"
                autoComplete="nickname"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="bio"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-bio">{copy.profile.biography}</FieldLabel>
              <Textarea {...field} id="profile-bio" aria-invalid={fieldState.invalid} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        {rootError ? (
          <p role="alert" className="text-sm text-destructive">
            {rootError}
          </p>
        ) : null}
        <Button type="submit" disabled={isSaving}>
          {isSaving ? copy.profile.saving : copy.profile.save}
        </Button>
      </FieldGroup>
    </form>
  );
}
