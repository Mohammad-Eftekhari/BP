import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileEditor } from "@/features/profile/components/ProfileEditor";
import { getLocale } from "@/lib/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const copy = getDictionary(await getLocale());
  return { title: copy.profile.title };
}

export default async function ProfilePage() {
  const locale = await getLocale();
  const copy = getDictionary(locale);

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>{copy.profile.title}</CardTitle>
        <CardDescription>{copy.profile.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <h1 className="sr-only">{copy.profile.title}</h1>
        <ProfileEditor key={locale} copy={copy} />
      </CardContent>
    </Card>
  );
}
