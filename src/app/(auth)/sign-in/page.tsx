import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EAppRoutes } from "@/constants/routes";
import { SignInForm } from "@/features/auth/components/SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
};

type TSignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignInPage({ searchParams }: TSignInPageProps) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" ? params.next : null;

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use the email and password for your account.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <h1 className="sr-only">Sign in</h1>
        <SignInForm nextPath={nextPath} />
        <p className="text-sm text-muted-foreground">
          New here?{" "}
          <Link href={EAppRoutes.signUp} className="underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
