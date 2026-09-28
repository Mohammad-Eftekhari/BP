import { sql } from "drizzle-orm";

import { db } from "@/db";
import { jsonError, jsonSuccess, handleRoute } from "@/lib/api/response";
import { logger } from "@/lib/logger/logger";

export const dynamic = "force-dynamic";

async function healthResponse(): Promise<Response> {
  try {
    await db.execute(sql`select 1`);
  } catch (error) {
    logger.error("Health check could not reach the database", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return jsonError("SERVICE_UNAVAILABLE", "Service unavailable");
  }

  return jsonSuccess({
    status: "ok" as const,
    database: "up" as const,
  });
}

export async function GET() {
  return handleRoute(healthResponse);
}

export async function HEAD() {
  return handleRoute(async () => {
    const response = await healthResponse();
    return new Response(null, { status: response.status });
  });
}
