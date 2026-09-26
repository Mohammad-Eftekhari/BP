import { EUserRole } from "@/constants/auth";
import { handleRoute, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleRoute(async () => {
    const session = await requireAuth();

    return jsonSuccess({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role ?? EUserRole.user,
    });
  });
}
