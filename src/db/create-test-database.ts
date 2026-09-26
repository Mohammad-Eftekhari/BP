import postgres from "postgres";

async function createTestDatabase() {
  const sourceUrl = process.env.DATABASE_URL;

  if (!sourceUrl) {
    throw new Error("DATABASE_URL is required to create the test database.");
  }

  const adminUrl = new URL(sourceUrl);
  adminUrl.pathname = "/postgres";
  const databaseName = "app_test";
  const sql = postgres(adminUrl.toString(), { max: 1 });
  const existing = await sql`select 1 from pg_database where datname = ${databaseName}`;

  if (existing.length === 0) {
    await sql.unsafe(`create database ${databaseName}`);
  }

  await sql.end();
}

createTestDatabase().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Could not create the test database";
  console.error(message);
  process.exit(1);
});
