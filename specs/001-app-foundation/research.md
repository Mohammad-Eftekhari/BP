# Research: Reusable Application Foundation

## Decision: Next.js 16 App Router with `src/proxy.ts`

**Rationale**: The installed Next.js 16 docs rename Middleware to Proxy. Optimistic redirects belong in `src/proxy.ts`. Authorization stays in Server Components and Route Handlers because a cookie check is not proof of a valid session.

**Alternatives considered**: `middleware.ts` is the pre-16 name and is rejected by current Next.js guidance. Full session lookup inside proxy is possible but slower and still must be repeated at the real boundary, so the proxy only checks for a session cookie.

## Decision: Better Auth with `@better-auth/drizzle-adapter`

**Rationale**: Current Better Auth Drizzle documentation installs `@better-auth/drizzle-adapter` and imports `drizzleAdapter` from that package. The Next.js guide mounts `toNextJsHandler` at `/api/auth/[...all]` and reads sessions with `auth.api.getSession({ headers })`. Email and password are enabled. `nextCookies()` is the last plugin so later server-side auth calls can set cookies. Rate limits use Better Auth's built-in limiter. `user.additionalFields.role` is server-controlled (`input: false`).

**Alternatives considered**: `better-auth/adapters/drizzle` still appears on the installation page, but the dedicated Drizzle adapter page is the current package path. A custom session table was rejected because it would duplicate Better Auth.

## Decision: Drizzle ORM with postgres.js and committed migrations

**Rationale**: Drizzle's PostgreSQL guide uses `drizzle-orm/postgres-js` and `postgres`. A global cache avoids extra pools during Next.js hot reload. `drizzle-kit generate` writes SQL into `drizzle/`. `drizzle-kit migrate` applies those files. `drizzle-kit push` remains a local-only script and is documented as unsafe for production.

**Alternatives considered**: The `pg` driver works, but postgres.js is the current Drizzle recommendation for this style of server. Prisma was rejected by the constitution.

## Decision: shadcn/ui on Tailwind CSS 4 with the Radix base

**Rationale**: The project already uses Tailwind CSS 4 from `create-next-app`. shadcn components are copied in as source. Initialize with defaults and `--base radix` so component APIs stay on the documented Radix primitives. `next-themes` supplies the class-based theme switch shadcn expects.

**Alternatives considered**: Base UI was skipped because the project skill warns that Radix-oriented component code is the compatible default.

## Decision: TanStack Query only for client server-state

**Rationale**: Next.js documents a browser QueryClient singleton and a fresh client per server render. The profile page is a client form that needs cache invalidation after save. The dashboard can read the session in a Server Component without a query.

**Alternatives considered**: Server prefetch plus dehydration adds complexity for one form and is deferred. Zustand was rejected by the constitution.

## Decision: Standardized JSON envelope

**Rationale**: Success is `{ success: true, data }`. Failure is `{ success: false, error: { code, message, details? } }`. A single mapper turns `AppError` and `ZodError` into that shape and logs unexpected errors without secrets.

**Alternatives considered**: Throwing raw `Response` objects from services would leak HTTP into the domain. Problem Details (RFC 9457) is clearer for public APIs but heavier than this internal envelope.

## Decision: Dedicated test database

**Rationale**: `DATABASE_URL` for Playwright and integration tests points at `app_test`, created by the local or CI PostgreSQL service. Vitest unit tests do not need a database. Destructive reset checks the hostname and refuses anything other than localhost unless `ALLOW_DESTRUCTIVE_DB=true`.

**Alternatives considered**: Sharing the developer database would violate the spec. An in-memory database would not exercise PostgreSQL constraints.

## Decision: Production image uses `output: "standalone"`

**Rationale**: Current Next.js deploying docs recommend standalone output for a minimal Docker runtime. The image does not copy `.env`. Runtime configuration is injected when the container starts.

**Alternatives considered**: A full `node_modules` runtime image is larger and unnecessary.
