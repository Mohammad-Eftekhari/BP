import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EAppRoutes } from "@/constants/routes";
import { SignUpForm } from "@/features/auth/components/SignUpForm";
import { getLocale } from "@/lib/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.signUp.title };
}

export default async function SignUpPage() {
  const locale = await getLocale();
  const copy = getDictionary(locale);

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>{copy.signUp.title}</CardTitle>
        <CardDescription>{copy.signUp.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <h1 className="sr-only">{copy.signUp.title}</h1>
        <SignUpForm key={locale} copy={copy} />
        <p className="text-sm text-muted-foreground">
          {copy.signUp.prompt}{" "}
          <Link href={EAppRoutes.signIn} className="underline-offset-4 hover:underline">
            {copy.signUp.alternate}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
