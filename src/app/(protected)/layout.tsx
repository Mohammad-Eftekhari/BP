import type { ReactNode } from "react";

import { requireUser } from "@/lib/auth/server";

type TProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({ children }: TProtectedLayoutProps) {
  await requireUser();
  return children;
}
