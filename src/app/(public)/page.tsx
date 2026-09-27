import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EAppRoutes } from "@/constants/routes";
import { getLocale } from "@/lib/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function HomePage() {
  const copy = getDictionary(await getLocale());

  return (
    <section className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{copy.home.title}</h1>
        <p className="text-muted-foreground">{copy.home.description}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href={EAppRoutes.signUp}>{copy.home.signUp}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={EAppRoutes.signIn}>{copy.home.signIn}</Link>
        </Button>
      </div>
    </section>
  );
}
