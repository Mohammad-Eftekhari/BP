import type { ReactNode } from "react";

import { requireAnonymous } from "@/lib/auth/server";

type TAuthLayoutProps = {
  children: ReactNode;
};

export default async function AuthLayout({ children }: TAuthLayoutProps) {
  await requireAnonymous();
  return children;
}
