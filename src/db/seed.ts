import { eq } from "drizzle-orm";

import { EUserRole } from "../constants/auth";
import { db } from "./index";
import { user } from "./schema";
import { auth } from "../lib/auth/auth";

const seedAccounts = [
  {
    name: "Member",
    email: "member@example.com",
    password: "password-member",
    role: EUserRole.user,
  },
  {
    name: "Admin",
    email: "admin@example.com",
    password: "password-admin",
    role: EUserRole.admin,
  },
] as const;

async function seed() {
  for (const account of seedAccounts) {
    const existing = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, account.email))
      .limit(1);

    if (existing.length === 0) {
      await auth.api.signUpEmail({
        body: {
          name: account.name,
          email: account.email,
          password: account.password,
        },
      });
    }

    if (account.role === EUserRole.admin) {
      await db.update(user).set({ role: EUserRole.admin }).where(eq(user.email, account.email));
    }
  }

  await db.$client.end({ timeout: 5 });
}

seed().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Seed failed";
  console.error(message);
  process.exit(1);
});
