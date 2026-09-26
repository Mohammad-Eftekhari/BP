import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getServerEnv } from "@/lib/env/server";

import * as schema from "./schema";

type TPostgresClient = ReturnType<typeof postgres>;

const globalForDb = globalThis as typeof globalThis & {
  postgresClient?: TPostgresClient;
};

function getPostgresClient(): TPostgresClient {
  if (!globalForDb.postgresClient) {
    globalForDb.postgresClient = postgres(getServerEnv().DATABASE_URL, {
      max: 10,
    });
  }

  return globalForDb.postgresClient;
}

export const db = drizzle(getPostgresClient(), { schema });

export type TDatabase = typeof db;
export type TTransaction = Parameters<Parameters<TDatabase["transaction"]>[0]>[0];
