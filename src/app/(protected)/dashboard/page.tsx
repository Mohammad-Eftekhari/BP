import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EAppRoutes } from "@/constants/routes";
import { requireUser } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await requireUser();

  return (
    <section className="flex max-w-2xl flex-col gap-4">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p>
        Signed in as <span className="font-medium">{session.user.name}</span> ({session.user.email}
        ).
      </p>
      <div>
        <Button asChild>
          <Link href={EAppRoutes.profile}>Edit profile</Link>
        </Button>
      </div>
    </section>
  );
}
