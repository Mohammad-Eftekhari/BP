import postgres from "postgres";

import { assertLocalDatabase } from "./local-database";

async function resetDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required.");
  }

  assertLocalDatabase(databaseUrl);

  const sql = postgres(databaseUrl, { max: 1 });

  await sql`drop schema if exists public cascade`;
  await sql`create schema public`;
  await sql`grant all on schema public to public`;
  await sql.end();
}

resetDatabase().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Database reset failed";
  console.error(message);
  process.exit(1);
});
