# Testing

Vitest covers pure rules and component behavior. Playwright covers the journeys that must work in a browser. CI runs both.

## Unit tests

```bash
pnpm test
pnpm test:watch
```

Put `*.test.ts` or `*.test.tsx` beside the module. The Vitest alias `@` points at `src`, and `server-only` is stubbed so server modules can be imported in unit tests. Do not open a database from a unit test.

Current coverage includes profile validation, the safe redirect helper, the destructive-database guard, and the sign-in form's empty-email path.

## End-to-end tests

```bash
pnpm db:create-test
pnpm db:migrate:test
pnpm exec playwright install chromium
pnpm test:e2e
```

Playwright starts `pnpm dev` locally with the installed Google Chrome channel, and `pnpm start` in CI with Playwright's Chromium. `scripts/with-test-database.sh` exports `DATABASE_URL` from `DATABASE_URL_TEST` for that process only.

The browser suite registers a new account, opens the dashboard, saves a profile, checks the admin route, rejects an empty display name, signs out, and confirms `/dashboard` returns to sign-in. A second test checks the generic sign-in failure. `tests/e2e/health.spec.ts` checks `GET /api/health` and anonymous rejection.

## What not to do

- Do not point `DATABASE_URL_TEST` at the database you use for `pnpm dev`.
- Do not call `pnpm db:reset` from CI or from Playwright.
- Do not skip a failing test to keep a pull request green.
- Pre-commit does not run Playwright. CI does.
