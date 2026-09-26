import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { EAppRoutes } from "@/constants/routes";
import { EUserRole, type TUserRole } from "@/constants/auth";
import { AppError } from "@/lib/api/errors";

import { auth, type TAuthSession } from "./auth";

export async function getCurrentSession(): Promise<TAuthSession | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

export async function requireAuth(): Promise<TAuthSession> {
  const session = await getCurrentSession();

  if (!session) {
    throw new AppError("UNAUTHENTICATED", "Authentication required");
  }

  return session;
}

export async function requireUser(): Promise<TAuthSession> {
  const session = await getCurrentSession();

  if (!session) {
    redirect(EAppRoutes.signIn);
  }

  return session;
}

export async function requireAnonymous() {
  const session = await getCurrentSession();

  if (session) {
    redirect(EAppRoutes.dashboard);
  }
}

export async function requireRole(role: TUserRole): Promise<TAuthSession> {
  const session = await requireAuth();

  if (session.user.role !== role) {
    throw new AppError("FORBIDDEN", "You do not have access to this resource");
  }

  return session;
}

export { EUserRole };
