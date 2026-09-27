# Architecture

This repository is one deployable Next.js application. It is not a set of services.

## Request path

```text
Browser
  → Server Component or Client Component
  → Route Handler
  → auth helper
  → Zod
  → service
  → repository
  → Drizzle
  → PostgreSQL
```

Server Components may read the session and render HTML. They do not run multi-step writes. Client Components call Route Handlers through `apiFetch` and cache the result with TanStack Query.

## Where code goes

| Concern                            | Location                            |
| ---------------------------------- | ----------------------------------- |
| URL and page                       | `src/app`                           |
| Shared visual primitives           | `src/components/ui`                 |
| Shared chrome                      | `src/components/shared`             |
| Feature forms, schemas, query keys | `src/features/<feature>`            |
| Business decisions                 | `src/server/services/<feature>`     |
| SQL                                | `src/server/repositories/<feature>` |
| Tables                             | `src/db/schema`                     |
| Auth helpers                       | `src/lib/auth`                      |
| Error and response shape           | `src/lib/api`                       |

A feature does not import another feature's components to reuse private behavior. Share it from `src/components` or `src/lib` when a second caller exists.

## Server-only modules

`src/db`, `src/lib/env/server.ts`, `src/lib/auth/auth.ts`, `src/lib/logger/logger.ts`, services, and repositories import `server-only`. A Client Component that imports them fails the build.

`src/proxy.ts` redirects anonymous browsers away from `/dashboard` and `/profile` when the session cookie is missing. Protected pages and Route Handlers still resolve the session.

## Transactions

Call `db.transaction` when two or more writes must commit together. A single profile upsert does not need one. Do not wrap reads in a transaction by habit.

## Internationalization

The interface language is `en` or `fa`, stored in the `locale` cookie. Persian sets `lang="fa"` and `dir="rtl"` on the document. English stays left-to-right. There is no translation catalog yet; strings stay in the components until a specification asks for a translation library.

UI text uses the Vazirmatn variable font in `src/fonts/Vazirmatn-wght.woff2`, loaded with `next/font/local` from `src/app/fonts.ts`. Replace that file to change the typeface. Geist Sans remains the fallback, and Geist Mono stays the monospace font.

## Reference profile

`src/features/profile` exists to prove the path from a form to PostgreSQL. The removal steps are in the README. Do not grow product behavior inside that feature.
