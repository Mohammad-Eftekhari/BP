"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { EAppRoutes } from "@/constants/routes";
import { authClient } from "@/lib/auth/auth-client";

type TSignOutButtonProps = {
  label: string;
};

export function SignOutButton({ label }: TSignOutButtonProps) {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push(EAppRoutes.home);
    router.refresh();
  }

  return (
    <Button type="button" variant="outline" onClick={handleSignOut}>
      {label}
    </Button>
  );
}
