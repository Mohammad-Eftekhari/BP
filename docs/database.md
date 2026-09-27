# Database

PostgreSQL 17 runs locally through Docker Compose. Drizzle owns the schema and the SQL migrations in `drizzle/`.

## Commands and where they are safe

| Command                | Local              | CI                                                                         | Staging                                     | Production                                  |
| ---------------------- | ------------------ | -------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------- |
| `pnpm db:generate`     | yes                | no                                                                         | no                                          | no                                          |
| `pnpm db:migrate`      | yes                | yes, against the test database                                             | yes, with that environment's `DATABASE_URL` | yes, with that environment's `DATABASE_URL` |
| `pnpm db:push`         | convenience only   | no                                                                         | no                                          | no                                          |
| `pnpm db:studio`       | yes                | no                                                                         | no                                          | no                                          |
| `pnpm db:seed`         | yes                | no                                                                         | no                                          | no                                          |
| `pnpm db:reset`        | yes, loopback only | no                                                                         | no                                          | no                                          |
| `pnpm db:create-test`  | yes                | the CI service creates `app_test` directly                                 | no                                          | no                                          |
| `pnpm db:migrate:test` | yes                | use `pnpm db:migrate` with `DATABASE_URL` already set to the test database | no                                          | no                                          |

`db:reset` drops the `public` schema. It throws unless the host is `localhost`, `127.0.0.1`, or `::1`, or `ALLOW_DESTRUCTIVE_DB=true`.

## Conventions

- Better Auth tables use the generated names in `src/db/schema/auth.ts`. Regenerate that file with the Better Auth CLI when auth config changes, then run `pnpm db:generate`.
- Application tables live beside it. `profile` is the sample.
- Use database unique constraints and foreign keys for invariants.
- Prefer `on delete cascade` when a row cannot outlive the account.
- Timestamps on application tables use `timestamptz`.
- Do not store passwords outside the Better Auth `account` table.

## Connection

`src/db/index.ts` keeps one postgres.js pool on `globalThis` so hot reload does not open a new pool on every save. The module imports `server-only`.

## Seed

`pnpm db:seed` creates two accounts if they are missing and sets the admin role. It is idempotent. It refuses nothing about the host on its own, so point `DATABASE_URL` at the local database before running it.

## Transactions

```ts
await db.transaction(async (tx) => {
  await tx.insert(profile).values(values);
  await tx.update(user).set(changes).where(eq(user.id, userId));
});
```

Use this when both writes must commit together. The profile save is one upsert and does not use a transaction.

## Test database

`pnpm db:create-test` creates `app_test` on the same PostgreSQL server as `DATABASE_URL`. `pnpm db:migrate:test` applies migrations there. Those commands are optional and are not part of CI. They leave the database named in `DATABASE_URL` alone.
