# Web Application Boilerplate Constitution

## Core Principles

### I. Server-First Next.js

The application MUST use the Next.js App Router. Pages and layouts MUST be Server
Components by default. A file MUST include `"use client"` only when it uses React
hooks, browser APIs, DOM events, client-only libraries, or interactive UI state.
`"use client"` MUST NOT be added for convenience, and MUST NOT appear on hooks,
types, constants, or barrel files.

### II. Explicit Backend Boundaries

No component, client hook, or shared UI module may import PostgreSQL, Drizzle, the
database client, server-only secrets, Better Auth server configuration, repositories,
or other private server services. Those modules MUST be protected with `server-only`
(or an equivalent Next.js server boundary) so an accidental client import fails at
build time. HTTP entry points are Route Handlers under `src/app/api`.

### III. Type Safety

TypeScript MUST run in strict mode. Unjustified `any`, blanket `eslint-disable`, and
unsafe casts are forbidden. Prefer inferred types inside a module and explicit domain
types at module boundaries. Database row types, domain types, transport DTOs, and
form values MUST stay distinct when their shapes differ. Do not weaken compiler or
lint settings to hide an error.

### IV. Validation at Boundaries

Every externally supplied input MUST be validated with Zod at the server boundary,
even when the client already validates the same form. Client validation is a user
experience mechanism. Server validation is a security and correctness mechanism.
Shared domain schemas MAY be reused. Database table types MUST NOT be forced into
UI schemas.

### V. Centralized Authentication, Separate Authorization

Authentication logic MUST live in one auth module. Application code MUST use shared
server helpers (`getCurrentUser`, `requireAuth`, `requireAnonymous`, and
`requireRole` or `requirePermission` when authorization is introduced) instead of
parsing cookies or sessions ad hoc. Authentication answers who the user is.
Authorization answers what that user may do. Frontend visibility is not
authorization. Every protected page and every protected Route Handler MUST enforce
access on the server. Sessions MUST use Better Auth's secure cookie model. Do not
introduce a parallel JWT or custom auth system.

### VI. Clear Persistence Boundaries

Route Handlers MUST stay thin: authenticate, authorize, validate, call a service,
and map the response. Routes MUST NOT contain raw SQL or complicated persistence
logic. The preferred flow is Route Handler → validation → service → repository →
Drizzle → PostgreSQL. A layer MAY be collapsed when the extra abstraction has no
caller or substitution value. Do not add repository interfaces, service classes,
factories, or dependency injection solely to match a diagram. Multi-step mutations
that must succeed or fail together MUST use a Drizzle transaction. Single queries
MUST NOT be wrapped in a transaction by default. Committed migrations are the
schema source of truth. `drizzle-kit push` is a local convenience only.

### VII. Server State Belongs to TanStack Query

Client-side server state MUST use TanStack Query. Do not duplicate API data in a
global store. Local transient UI state MUST use React state or context. Do not
fetch server data in arbitrary `useEffect` blocks when a query or mutation is the
right tool. Do not add Redux, Zustand, Axios, GraphQL, tRPC, Prisma, or another
backend framework unless a later specification explicitly justifies it.

### VIII. This Starter Does Not Ship a Test Suite

This boilerplate does not include unit tests or end-to-end tests. A feature is not
incomplete solely because it has no test file. Critical behavior MUST remain
understandable enough to check by using the application. Quality checks are
`pnpm lint`, `pnpm typecheck`, and `pnpm build`. Pre-commit hooks MUST stay fast.
Do not add Vitest, Playwright, or another test runner unless a later specification
requires it.

### IX. AI-Friendly, Incrementally Evolvable Repository

Code and placement MUST be obvious to humans and coding agents. Prefer predictable
names and folders over clever abstractions. Spec Kit artifacts under `.specify/`
and `specs/` are the behavioral contract for meaningful features. When intended
behavior changes, update the specification first, then the plan and tasks, then
the implementation. Do not let specifications silently drift. Cursor project rules
MUST stay separate from Spec Kit-owned skill files.

### X. Simplicity Over Accidental Architecture

This repository is a modular monolith: one Next.js deployment unit containing UI,
Route Handlers, and database access. Do not introduce microservices, message
queues, CQRS, DDD aggregates, event buses, Redis, Kubernetes, or a permission
framework before a documented requirement needs them. Before adding a dependency,
confirm the current stack cannot provide the behavior, confirm compatibility with
the installed Next.js and React versions, and add the smallest maintained package
that solves the problem.

## Technology Constraints

The stack is Next.js, React, TypeScript, pnpm, Tailwind CSS, shadcn/ui, TanStack
Query, React Hook Form, Zod, Better Auth, Drizzle ORM, and PostgreSQL. Tooling is
ESLint, Prettier, Docker, and GitHub Actions. Application HTTP calls use the native `fetch` wrapper in `src/lib/api`.

Import alias `@/*` maps to `src/*`. Feature UI lives in `src/features/<feature>`.
Server business logic lives in `src/server/services`. Persistence lives in
`src/server/repositories` and `src/db`. Shared UI primitives live in
`src/components/ui`. Route groups separate public, auth, and protected pages.

Environment variables MUST be validated with Zod. Server secrets MUST NOT use the
`NEXT_PUBLIC_` prefix. `.env` MUST NOT be committed. `.env.example` MUST contain
placeholders only. Production error responses MUST NOT include stack traces, SQL,
secrets, or authentication material. Logs MUST NOT include passwords, session
secrets, tokens, raw authorization headers, or sensitive personal data.

Security defaults that MUST remain in place: secure auth cookies in production,
trusted origins, authentication rate limiting, server-side authorization, Zod
validation, parameterized Drizzle queries, and same-origin APIs unless a
specification requires otherwise. User-facing UI MUST use accessible labels,
keyboard access, visible focus, and semantic controls. Layouts MUST remain usable
for right-to-left languages. Do not install a full internationalization framework
until a specification requires it.

## Development Workflow

Meaningful features follow Spec-Driven Development:

1. Create or enter a feature branch.
2. Write or update the specification (`/speckit-specify`).
3. Clarify material ambiguity when it exists (`/speckit-clarify`).
4. Create the technical plan (`/speckit-plan`).
5. Generate tasks (`/speckit-tasks`).
6. Analyze consistency before implementation (`/speckit-analyze`).
7. Implement small task groups (`/speckit-implement`).
8. Run lint, typecheck, and build as appropriate.
9. Converge remaining gaps (`/speckit-converge`).
10. Commit and open a pull request.

Trivial fixes do not require the full workflow. A feature that is too large for one
specify → plan → tasks cycle MAY be split into a spec of specs. Quality gates are
`pnpm lint`, `pnpm typecheck`, and `pnpm build`. Destructive
database commands MUST NOT be easy to run against production.

Runtime development guidance lives in `docs/` and `.cursor/rules/`. Those documents
explain how to comply with this constitution. They do not override it.

## Governance

This constitution supersedes informal practice, README examples, and agent habits
when they conflict. Amendments MUST update `.specify/memory/constitution.md`, bump
the version using semantic versioning, set **Last Amended** to the amendment date,
and describe the governance change in the pull request. MAJOR means a principle was
removed or redefined incompatibly. MINOR means a principle or section was added or
materially expanded. PATCH means wording was clarified without changing the rule.

Pull requests and agent reviews MUST check the change against the principles it
touches: server/client boundaries, validation, auth and authorization, persistence,
and dependency additions. Complexity beyond this constitution MUST be
justified in the specification. Compliance is reviewed at plan time and again
before merge. The specification remains the behavioral contract. This constitution
remains the governance contract.

**Version**: 2.0.0 | **Ratified**: 2026-09-26 | **Last Amended**: 2026-09-27
