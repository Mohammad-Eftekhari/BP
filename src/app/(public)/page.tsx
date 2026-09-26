import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EAppRoutes } from "@/constants/routes";

export default function HomePage() {
  return (
    <section className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Application starter</h1>
        <p className="text-muted-foreground">
          A neutral starting point for a web application with accounts, a private area, and one
          reference profile you can replace.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href={EAppRoutes.signUp}>Create account</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={EAppRoutes.signIn}>Sign in</Link>
        </Button>
      </div>
    </section>
  );
}
