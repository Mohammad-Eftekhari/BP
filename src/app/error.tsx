"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type TErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: TErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex max-w-lg flex-col gap-4">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground">The page could not be displayed. You can try again.</p>
      <div>
        <Button type="button" onClick={reset}>
          Try again
        </Button>
      </div>
    </section>
  );
}
