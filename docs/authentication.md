# Authentication

Better Auth owns registration, sign-in, sign-out, and the session cookie. The HTTP handler is `src/app/api/auth/[...all]/route.ts`. The server instance is `src/lib/auth/auth.ts`. The browser client is `src/lib/auth/auth-client.ts`.

## Helpers

| Helper                 | Use it in           | Behavior                                        |
| ---------------------- | ------------------- | ----------------------------------------------- |
| `getCurrentUser()`     | Server Components   | Returns the user or `null`                      |
| `requireUser()`        | protected pages     | Redirects to `/sign-in`                         |
| `requireAnonymous()`   | sign-in and sign-up | Redirects signed-in people to `/dashboard`      |
| `requireAuth()`        | Route Handlers      | Throws `UNAUTHENTICATED`                        |
| `requireRole("admin")` | Route Handlers      | Throws `FORBIDDEN` when the role does not match |

`requireRole` checks the stored role exactly. It does not treat an administrator as every other role. Add that hierarchy in a later specification if a product needs it.

## Rules that stay true

- Registration cannot set `role`. New accounts are `user`.
- The seed script is the supported way to mark `admin@example.com` as `admin` locally.
- Cookies are secure when `NODE_ENV` is `production`.
- Sign-in and sign-up are rate limited by Better Auth.
- `trustedOrigins` comes from `BETTER_AUTH_URL` plus `BETTER_AUTH_TRUSTED_ORIGINS`.
- Do not parse the session cookie in feature code.
- Do not add a second session mechanism.

## Not enabled yet

Google, GitHub, password reset, email verification, magic links, passkeys, two-factor authentication, and organizations are intentionally absent. Add one by extending `src/lib/auth/auth.ts` and generating a new auth schema migration when the specification says so.

## Authorization example

`GET /api/admin/status` calls `requireRole("admin")`. A signed-in member receives 403. A signed-out caller receives 401. The dashboard does not imply access to that route.
