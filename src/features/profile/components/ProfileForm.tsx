"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EApiRoutes } from "@/constants/routes";
import { profileQueryKeys } from "@/features/profile/queries/profile-keys";
import {
  profileFormSchema,
  profileResponseSchema,
  type TProfile,
  type TProfileValues,
} from "@/features/profile/schemas/profile.schema";
import { ApiClientError, apiFetch } from "@/lib/api/client";

type TProfileFormProps = {
  initialProfile: TProfile;
};

export function ProfileForm({ initialProfile }: TProfileFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<TProfileValues>({
    resolver: zodResolver(profileFormSchema),
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
      toast.success("Profile saved");
    },
    onError: (error) => {
      const message =
        error instanceof ApiClientError ? error.message : "Could not save the profile.";
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
              <FieldLabel htmlFor="profile-display-name">Display name</FieldLabel>
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
              <FieldLabel htmlFor="profile-bio">Biography</FieldLabel>
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
          {isSaving ? "Saving..." : "Save profile"}
        </Button>
      </FieldGroup>
    </form>
  );
}
