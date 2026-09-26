# Implementation Plan: Reusable Application Foundation

**Branch**: `001-app-foundation` | **Date**: 2026-09-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-app-foundation/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Deliver one Next.js modular monolith a frontend engineer can clone and extend. Server Components render public and protected pages. Route Handlers expose a thin HTTP API. Better Auth with the Drizzle adapter stores email/password accounts in PostgreSQL. A single profile feature proves the path from a validated form through TanStack Query to a repository. Docker Compose runs local PostgreSQL. Vitest and Playwright cover critical behavior. GitHub Actions and a standalone Docker image reproduce the production checks.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 24, Next.js 16.3 App Router, React 19

**Primary Dependencies**: pnpm, Tailwind CSS 4, shadcn/ui (Radix source components), TanStack Query, React Hook Form, Zod, Better Auth, `@better-auth/drizzle-adapter`, Drizzle ORM, `postgres` (postgres.js)

**Storage**: PostgreSQL 17 via Docker Compose locally and a connection string in deployment

**Testing**: Vitest, React Testing Library, Playwright

**Target Platform**: Linux server and local developer machines; browser UI

**Project Type**: Modular monolith web application (UI and HTTP API in one Next.js deployment)

**Performance Goals**: Status check stays a single lightweight query. No extra cache layer until a measured need exists.

**Constraints**: Strict TypeScript. No `any` to silence errors. Server-only database and auth modules. Same-origin API. Secrets stay off `NEXT_PUBLIC_*`. Committed SQL migrations are the deploy source of truth.

**Scale/Scope**: One public home page, sign-in, sign-up, dashboard, profile, health, and a small admin probe. Built for reuse, not for a specific product domain.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                | Gate                                                                                                       | Result |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- | ------ |
| I. Server-first          | Pages and layouts are Server Components. Client components are limited to forms, theme, and sign-out.      | Pass   |
| II. Backend boundaries   | Database, repositories, services, and auth config import `server-only`.                                    | Pass   |
| III. Type safety         | Strict TypeScript. DTOs are not raw table types.                                                           | Pass   |
| IV. Validation           | Zod on every Route Handler body. Forms use the same schemas where the shapes match.                        | Pass   |
| V. Auth vs authorization | `getCurrentUser`, `requireAuth`, `requireAnonymous`, `requireRole` wrap Better Auth.                       | Pass   |
| VI. Persistence          | Thin routes, services, repositories. Transactions only for multi-step atomic writes. Migrations committed. | Pass   |
| VII. Server state        | Profile reads and writes use TanStack Query. No global store.                                              | Pass   |
| VIII. Tests              | Unit tests plus Playwright for the account journey, health, and access denial.                             | Pass   |
| IX. AI-friendly          | Cursor rules separate from Spec Kit skills. Specs updated with behavior.                                   | Pass   |
| X. Simplicity            | No repository interfaces, DI, queues, or permission framework.                                             | Pass   |

Post-design re-check: the profile repository is a small module of functions, not an interface with one implementation. Pass.

## Project Structure

### Documentation (this feature)

```text
specs/001-app-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── health.md
│   ├── account.md
│   └── profile.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (public)/
│   ├── (auth)/sign-in/
│   ├── (auth)/sign-up/
│   ├── (protected)/dashboard/
│   ├── (protected)/profile/
│   ├── api/auth/[...all]/
│   ├── api/health/
│   ├── api/me/
│   ├── api/profile/
│   └── api/admin/status/
├── components/ui/
├── components/shared/
├── features/profile/
├── lib/auth/
├── lib/api/
├── lib/query/
├── lib/env/
├── lib/logger/
├── server/services/
├── server/repositories/
└── db/
drizzle/
tests/e2e/
```

**Structure Decision**: Single Next.js project under `src/`. UI features live in `src/features`. Server use-cases live in `src/server`. Persistence lives in `src/db` and repositories. Route groups separate public, authentication, and protected pages. `src/proxy.ts` only performs an optimistic session-cookie redirect. Pages and Route Handlers still authorize on the server.

## Complexity Tracking

No constitution violations require justification.
