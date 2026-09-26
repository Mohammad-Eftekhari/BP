import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EAppRoutes } from "@/constants/routes";

export default function NotFound() {
  return (
    <section className="flex max-w-lg flex-col gap-4">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">That address is not part of this application.</p>
      <div>
        <Button asChild>
          <Link href={EAppRoutes.home}>Back to home</Link>
        </Button>
      </div>
    </section>
  );
}
