import "server-only";

import type { TProfile } from "@/features/profile/schemas/profile.schema";
import {
  findProfileByUserId,
  upsertProfile,
} from "@/server/repositories/profile/profile-repository";

type TProfileOwner = {
  id: string;
  name: string;
};

export async function getOwnProfile(owner: TProfileOwner): Promise<TProfile> {
  const record = await findProfileByUserId(owner.id);

  if (!record) {
    return {
      displayName: owner.name,
      bio: "",
      persisted: false,
    };
  }

  return {
    displayName: record.displayName,
    bio: record.bio,
    persisted: true,
  };
}

export async function saveOwnProfile(
  userId: string,
  input: { displayName: string; bio: string },
): Promise<TProfile> {
  const record = await upsertProfile({
    userId,
    displayName: input.displayName,
    bio: input.bio,
  });

  return {
    displayName: record.displayName,
    bio: record.bio,
    persisted: true,
  };
}
