import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EAppRoutes } from "@/constants/routes";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignUpPage() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Choose a name, email, and password.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <h1 className="sr-only">Create account</h1>
        <SignUpForm />
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={EAppRoutes.signIn} className="underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
