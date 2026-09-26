import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileEditor } from "@/features/profile/components/ProfileEditor";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          This reference feature saves a display name and biography for the signed-in account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h1 className="sr-only">Profile</h1>
        <ProfileEditor />
      </CardContent>
    </Card>
  );
}
