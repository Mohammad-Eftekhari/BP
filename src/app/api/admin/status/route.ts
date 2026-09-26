import { EUserRole } from "@/constants/auth";
import { handleRoute, jsonSuccess } from "@/lib/api/response";
import { requireRole } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleRoute(async () => {
    await requireRole(EUserRole.admin);
    return jsonSuccess({ ok: true as const });
  });
}
