"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { EAppRoutes } from "@/constants/routes";
import { authClient } from "@/lib/auth/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push(EAppRoutes.home);
    router.refresh();
  }

  return (
    <Button type="button" variant="outline" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
