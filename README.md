# Application starter

A reusable Next.js modular monolith for future web applications. It includes the interface, Route Handlers, email and password accounts, PostgreSQL, a reference profile, tests, Docker, and a Spec Kit workflow for Cursor.

## Architecture

The browser talks to the Next.js App Router. Server Components render pages. Client Components use TanStack Query when they need client-side server state. Route Handlers validate input, check the session, and call a service. Services call repositories. Repositories use Drizzle. Drizzle talks to PostgreSQL.

Read [docs/architecture.md](docs/architecture.md) for the boundaries. Do not import the database, repositories, or the Better Auth server config from a Client Component.

## Folder structure

```text
src/app            routes, layouts, and Route Handlers
src/components/ui  shadcn/ui source components
src/features       feature UI, schemas, and query hooks
src/server         services and repositories
src/db             Drizzle client, schema, seed, and reset
src/lib            auth, API helpers, env, logging, and TanStack Query
drizzle            committed SQL migrations
specs              Spec Kit feature contracts
.cursor/rules      project rules for coding agents
.cursor/skills     Spec Kit skills (do not edit by hand)
```

## Prerequisites

- Node.js 24. `.nvmrc` selects Node 24 for nvm. `.npmrc` makes pnpm download Node.js 24.11.1 and use it for installs and scripts, including when the shell `node` is older.
- pnpm 10.25
- Docker with Compose

## Installation

```bash
pnpm install
cp .env.example .env
```

Generate a real `BETTER_AUTH_SECRET` before sharing an environment. `openssl rand -base64 32` is enough. The value must be at least 32 characters.

## Environment variables

| Variable                                                             | Who reads it   | Purpose                       |
| -------------------------------------------------------------------- | -------------- | ----------------------------- |
| `DATABASE_URL`                                                       | server         | PostgreSQL connection string  |
| `DATABASE_URL_TEST`                                                  | tests          | Dedicated test database       |
| `BETTER_AUTH_SECRET`                                                 | server         | Session encryption secret     |
| `BETTER_AUTH_URL`                                                    | server         | Public base URL of this app   |
| `BETTER_AUTH_TRUSTED_ORIGINS`                                        | server         | Comma-separated extra origins |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT` | Docker Compose | Local database container      |

Never put secrets in `NEXT_PUBLIC_*` variables. `.env` is gitignored. `.env.example` contains placeholders only.

## PostgreSQL

```bash
docker compose up -d
docker compose ps
docker compose down
```

`docker compose down` keeps the volume. `docker compose down -v` deletes local data.

## Authentication

Email and password registration, sign-in, sign-out, and session lookup are provided by Better Auth. Pages and Route Handlers call `requireUser`, `requireAnonymous`, `requireAuth`, or `requireRole`. A redirect in the browser is not authorization.

Local seed accounts, after `pnpm db:seed`:

- `member@example.com` / `password-member`
- `admin@example.com` / `password-admin`

These passwords are local sample data. Do not reuse them in a deployed environment.

Details: [docs/authentication.md](docs/authentication.md).

## Database migrations

```bash
pnpm db:generate   # create a SQL migration from the schema
pnpm db:migrate    # apply committed migrations
pnpm db:seed       # insert local sample accounts
pnpm db:studio     # open Drizzle Studio
pnpm db:push       # local schema sync only; not for production
pnpm db:reset      # drop the local public schema and migrate again
```

`db:reset` refuses any host other than `localhost`, `127.0.0.1`, or `::1` unless `ALLOW_DESTRUCTIVE_DB=true`.

Committed files in `drizzle/` are the source of truth for deployed databases. Details: [docs/database.md](docs/database.md).

## Running tests

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
```

## Running end-to-end tests

```bash
pnpm db:create-test
pnpm db:migrate:test
pnpm test:e2e
pnpm test:e2e:ui
```

Local runs use the Google Chrome already installed on the machine. CI installs Playwright's Chromium. If neither is available, install a browser with `pnpm exec playwright install chromium`.

`test:e2e` points `DATABASE_URL` at `DATABASE_URL_TEST` for the Playwright process. It does not reset your normal database.

## Build and deploy

```bash
pnpm build
pnpm start
```

Production image:

```bash
docker build -t web-boilerplate .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/app \
  -e BETTER_AUTH_SECRET=replace-with-at-least-32-characters \
  -e BETTER_AUTH_URL=http://localhost:3000 \
  web-boilerplate
```

The image does not contain `.env`. Pass runtime configuration when the container starts. `DATABASE_URL` must be reachable from inside the container.

## Spec-driven development

Meaningful features follow Spec Kit in Cursor:

```text
/speckit-constitution
/speckit-specify
/speckit-clarify        when something material is ambiguous
/speckit-plan
/speckit-checklist      when a quality gate helps
/speckit-tasks
/speckit-analyze
/speckit-implement
/speckit-converge
```

The current feature contract is `specs/001-app-foundation`. Skills live in `.cursor/skills` and are managed by `specify`. Project rules live in `.cursor/rules`.

Details: [docs/sdd.md](docs/sdd.md).

## How to add a feature

1. Create a branch.
2. Update or add a specification under `specs/`.
3. Plan, list tasks, and implement the smallest slice.
4. Add UI under `src/features/<feature>`.
5. Add server logic under `src/server/services/<feature>` and `src/server/repositories/<feature>`.
6. Add a thin Route Handler under `src/app/api/<feature>`.
7. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.

## How to add a database table

1. Add a Drizzle table in `src/db/schema` and export it from `src/db/schema/index.ts`.
2. Run `pnpm db:generate`.
3. Review the SQL in `drizzle/`.
4. Run `pnpm db:migrate` locally and `pnpm db:migrate:test` for the test database.
5. Read and write the table from a repository, not from a Route Handler or component.

Use `db.transaction` only when several writes must succeed or fail together.

## How to add an authenticated API endpoint

1. Add the path to `EApiRoutes`.
2. Create `src/app/api/.../route.ts`.
3. Call `requireAuth()` or `requireRole()`.
4. Parse the body with Zod.
5. Call a service and return `jsonSuccess`.
6. Throw `AppError` for expected failures. `handleRoute` maps unexpected errors to a safe response.

## How to add a protected page

1. Put the page under `src/app/(protected)`.
2. The group layout calls `requireUser()`, which redirects anonymous visitors.
3. If the page needs a role, check it in the Server Component as well.
4. Do not rely on `src/proxy.ts`. That file only looks for a session cookie.

## How to write tests

- Unit tests live next to the code as `*.test.ts`.
- Browser journeys live in `tests/e2e`.
- Database tests use `app_test`.

Details: [docs/testing.md](docs/testing.md).

## How to remove the reference profile

The profile feature is the sample vertical slice. To remove it from a product:

1. Delete `src/features/profile`, `src/server/services/profile`, `src/server/repositories/profile`, `src/app/(protected)/profile`, and `src/app/api/profile`.
2. Remove the profile links from the header and dashboard.
3. Delete `src/db/schema/profile.ts` and its export.
4. Generate a migration that drops the `profile` table.
5. Remove the profile end-to-end steps and the profile schema unit test.
6. Keep accounts, the dashboard, and `GET /api/health`.

## Scripts

| Script                               | What it does                |
| ------------------------------------ | --------------------------- |
| `pnpm dev`                           | Next.js development server  |
| `pnpm build` / `pnpm start`          | Production build and server |
| `pnpm lint` / `pnpm lint:fix`        | ESLint                      |
| `pnpm format` / `pnpm format:check`  | Prettier                    |
| `pnpm typecheck`                     | `tsc --noEmit`              |
| `pnpm test` / `pnpm test:watch`      | Vitest                      |
| `pnpm test:e2e` / `pnpm test:e2e:ui` | Playwright                  |

Pre-commit runs Prettier and ESLint on staged files. CI runs format, lint, types, unit tests, migrations, the production build, and Playwright.
