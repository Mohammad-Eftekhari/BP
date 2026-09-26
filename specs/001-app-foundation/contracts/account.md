# Contract: Account

Better Auth owns registration, sign-in, sign-out, and session retrieval under `/api/auth/*`. Application code MUST NOT reimplement those routes.

## Registration

Client calls the Better Auth sign-up method with `name`, `email`, and `password`.

- Password length is at least 8 and at most 128 characters.
- `role` is not an accepted input. The stored role is `user`.
- Duplicate email returns a generic failure and does not create a second account.
- Sensitive sign-up and sign-in routes are rate limited.

## Sign-in

Client calls the Better Auth email sign-in method.

- Unknown email and wrong password produce the same generic failure.
- Success sets the Better Auth session cookie. Production cookies are secure.

## Sign-out

Client calls the Better Auth sign-out method. The session cookie is cleared.

## Session

Server helpers call `auth.api.getSession` with the incoming request headers.

## `GET /api/me`

Authentication: required.

### Success `200`

```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "user"
  }
}
```

Password verifiers, session tokens, and account rows are omitted.

### Missing session `401`

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHENTICATED",
    "message": "Authentication required"
  }
}
```

## `GET /api/admin/status`

Authentication: required. Authorization: role `admin`.

### Success `200`

```json
{
  "success": true,
  "data": {
    "ok": true
  }
}
```

### Signed in without the role `403`

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have access to this resource"
  }
}
```

## Optimistic redirect

`src/proxy.ts` redirects anonymous browsers from `/dashboard` and `/profile` to `/sign-in`. This is not the security control. The pages and the routes above still resolve the session.
