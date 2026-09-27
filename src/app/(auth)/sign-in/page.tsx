import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EAppRoutes } from "@/constants/routes";
import { SignInForm } from "@/features/auth/components/SignInForm";
import { getLocale } from "@/lib/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.signIn.title };
}

type TSignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignInPage({ searchParams }: TSignInPageProps) {
  const [params, locale] = await Promise.all([searchParams, getLocale()]);
  const copy = getDictionary(locale);
  const nextPath = typeof params.next === "string" ? params.next : null;

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>{copy.signIn.title}</CardTitle>
        <CardDescription>{copy.signIn.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <h1 className="sr-only">{copy.signIn.title}</h1>
        <SignInForm key={locale} copy={copy} nextPath={nextPath} />
        <p className="text-sm text-muted-foreground">
          {copy.signIn.prompt}{" "}
          <Link href={EAppRoutes.signUp} className="underline-offset-4 hover:underline">
            {copy.signIn.alternate}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
