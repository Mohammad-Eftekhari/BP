import { profileResponseSchema } from "@/features/profile/schemas/profile.schema";
import { handleRoute, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/server";
import { getLocale } from "@/lib/get-locale";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createProfileRequestSchema } from "@/lib/i18n/schemas";
import { getOwnProfile, saveOwnProfile } from "@/server/services/profile/profile-service";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleRoute(async () => {
    const session = await requireAuth();
    const profile = await getOwnProfile({
      id: session.user.id,
      name: session.user.name,
    });

    return jsonSuccess(profileResponseSchema.parse(profile));
  });
}

export async function PUT(request: Request) {
  return handleRoute(async () => {
    const session = await requireAuth();
    const dictionary = getDictionary(await getLocale());
    const body: unknown = await request.json().catch(() => null);
    const input = createProfileRequestSchema(dictionary.validation).parse(body);
    const profile = await saveOwnProfile(session.user.id, input);

    return jsonSuccess(profileResponseSchema.parse(profile));
  });
}
