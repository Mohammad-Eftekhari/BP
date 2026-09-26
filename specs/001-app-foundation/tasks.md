# Tasks: Reusable Application Foundation

**Input**: Design documents from `/specs/001-app-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Required by the specification (FR-018, User Story 5).

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (for example, US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Add runtime and development dependencies in `package.json`
- [x] T002 Configure Prettier, ESLint, TypeScript scripts, and path aliases
- [x] T003 Initialize shadcn/ui and add the base component set under `src/components/ui`
- [x] T004 Add `.env.example`, env validation in `src/lib/env/server.ts`, and ignore rules that keep `.env` untracked

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T005 Add Docker Compose PostgreSQL in `docker-compose.yml`
- [x] T006 Add the Drizzle client, config, and migration scripts in `src/db/index.ts` and `drizzle.config.ts`
- [x] T007 Add the API envelope, error mapper, and typed fetcher in `src/lib/api`
- [x] T008 Add the server logger in `src/lib/logger/logger.ts`
- [x] T009 Add the TanStack Query provider in `src/lib/query`
- [x] T010 Add shared layout, theme, metadata, not-found, and error boundaries

## Phase 3: User Story 1 - Public application shell (Priority: P1)

- [x] T011 [US1] Replace the starter home page with a neutral public landing page
- [x] T012 [US1] Add loading, error, and not-found states that return visitors to the home page

## Phase 4: User Story 2 - Accounts and private area (Priority: P1)

- [x] T013 [US2] Configure Better Auth, generate the auth schema, and mount `/api/auth/[...all]`
- [x] T014 [US2] Add server auth helpers in `src/lib/auth/server.ts`
- [x] T015 [US2] Add sign-in and sign-up forms and a protected dashboard
- [x] T016 [US2] Add optimistic `src/proxy.ts` redirects and `GET /api/me`
- [x] T017 [US2] Add `GET /api/admin/status` guarded by `requireRole("admin")`

## Phase 5: User Story 3 - Profile reference feature (Priority: P2)

- [x] T018 [US3] Add the profile table, repository, and service
- [x] T019 [US3] Add `GET` and `PUT /api/profile` with Zod validation
- [x] T020 [US3] Add the profile form, query hook, and protected profile page

## Phase 6: User Story 4 - Status check (Priority: P2)

- [x] T021 [US4] Add `GET /api/health` with a database connectivity probe and a safe failure body

## Phase 7: User Story 5 - Automated checks (Priority: P3)

- [x] T022 [US5] Add Vitest coverage for validation, the error mapper, and the sign-in form
- [x] T023 [US5] Add Playwright coverage for health, registration, profile, sign-out, and rejected access
- [x] T024 [US5] Document and wire the dedicated `app_test` database

## Phase 8: User Story 6 - Delivery and maintenance (Priority: P3)

- [x] T025 [US6] Add the production Dockerfile and standalone Next.js output
- [x] T026 [US6] Add the GitHub Actions workflow and Husky pre-commit checks
- [x] T027 [US6] Add README, `docs/`, and `.cursor/rules` without editing Spec Kit skills
- [x] T028 [US6] Add deterministic seed and a local-only database reset guard

## Dependencies

- Setup and foundational tasks block every story.
- US2 blocks US3 because profile writes require an account.
- US4 can follow foundational database access.
- US5 follows the routes it exercises.
- US6 can start once scripts exist and finishes after the routes are stable.

## Parallel Example: User Story 2

T015 (forms and dashboard) and T017 (admin route) can proceed in parallel after T014.

## Implementation Strategy

Build the shell, then accounts, then the profile slice, then health, tests, and delivery. Validate with `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` before claiming a phase is done.
