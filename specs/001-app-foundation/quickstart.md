# Quickstart

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL: `docker compose up -d`.
3. Install dependencies: `pnpm install`.
4. Apply migrations: `pnpm db:migrate`.
5. Optional sample accounts: `pnpm db:seed`.
6. Start the app: `pnpm dev` and open `http://localhost:3000`.
7. Create an account or sign in with the seeded member account from the database document.
8. Open Profile, save a display name, reload, and sign out.

Checks:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Browser checks expect the test database documented in `docs/testing.md`.
