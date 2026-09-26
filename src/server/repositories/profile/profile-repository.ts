import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profile } from "@/db/schema";

export type TProfileRecord = typeof profile.$inferSelect;

type TUpsertProfileInput = {
  userId: string;
  displayName: string;
  bio: string;
};

export async function findProfileByUserId(userId: string): Promise<TProfileRecord | null> {
  const rows = await db.select().from(profile).where(eq(profile.userId, userId)).limit(1);
  return rows[0] ?? null;
}

export async function upsertProfile(input: TUpsertProfileInput): Promise<TProfileRecord> {
  const rows = await db
    .insert(profile)
    .values({
      userId: input.userId,
      displayName: input.displayName,
      bio: input.bio,
    })
    .onConflictDoUpdate({
      target: profile.userId,
      set: {
        displayName: input.displayName,
        bio: input.bio,
        updatedAt: new Date(),
      },
    })
    .returning();

  const saved = rows[0];

  if (!saved) {
    throw new Error("Profile upsert did not return a row");
  }

  return saved;
}
