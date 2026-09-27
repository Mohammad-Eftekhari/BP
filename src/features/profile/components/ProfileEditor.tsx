"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EApiRoutes } from "@/constants/routes";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { profileResponseSchema } from "@/features/profile/schemas/profile.schema";
import type { TDictionary } from "@/lib/i18n/en";
import { useFetcher } from "@/lib/query";

type TProfileEditorProps = {
  copy: TDictionary;
};

export function ProfileEditor({ copy }: TProfileEditorProps) {
  const profileQuery = useFetcher({
    url: EApiRoutes.profile,
    schema: profileResponseSchema,
    enabled: true,
  });

  if (profileQuery.isPending) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true" aria-live="polite">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p role="alert">{copy.profile.loadError}</p>
        <Button type="button" variant="outline" onClick={() => profileQuery.refetch()}>
          {copy.profile.tryAgain}
        </Button>
      </div>
    );
  }

  return <ProfileForm copy={copy} initialProfile={profileQuery.data} />;
}
