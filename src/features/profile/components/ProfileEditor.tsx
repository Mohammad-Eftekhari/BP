"use client";

import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EApiRoutes } from "@/constants/routes";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { profileQueryKeys } from "@/features/profile/queries/profile-keys";
import { profileResponseSchema } from "@/features/profile/schemas/profile.schema";
import { apiFetch } from "@/lib/api/client";

export function ProfileEditor() {
  const profileQuery = useQuery({
    queryKey: profileQueryKeys.current,
    queryFn: () => apiFetch(EApiRoutes.profile, profileResponseSchema),
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
        <p role="alert">The profile could not be loaded.</p>
        <Button type="button" variant="outline" onClick={() => profileQuery.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return <ProfileForm initialProfile={profileQuery.data} />;
}
