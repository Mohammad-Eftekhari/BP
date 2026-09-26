# API

Route Handlers live under `src/app/api`. They stay thin.

## Response shape

Success:

```json
{ "success": true, "data": {} }
```

Failure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [{ "field": "displayName", "message": "Display name is required" }]
  }
}
```

| Code                  | Status |
| --------------------- | ------ |
| `VALIDATION_ERROR`    | 400    |
| `UNAUTHENTICATED`     | 401    |
| `FORBIDDEN`           | 403    |
| `NOT_FOUND`           | 404    |
| `CONFLICT`            | 409    |
| `BUSINESS_RULE`       | 422    |
| `RATE_LIMITED`        | 429    |
| `SERVICE_UNAVAILABLE` | 503    |
| `INTERNAL_ERROR`      | 500    |

Unexpected errors are logged and returned as `INTERNAL_ERROR` without a stack trace or SQL. The logger redacts passwords, tokens, cookies, secrets, and email fields.

## Endpoints in this starter

| Method        | Path                | Access                      |
| ------------- | ------------------- | --------------------------- |
| `GET`, `POST` | `/api/auth/*`       | Better Auth                 |
| `GET`         | `/api/health`       | public, no internals        |
| `GET`         | `/api/me`           | signed in                   |
| `GET`, `PUT`  | `/api/profile`      | signed in, own profile only |
| `GET`         | `/api/admin/status` | role `admin`                |

`PUT /api/profile` ignores any account id in the body. The repository writes `session.user.id`.

## Client calls

`apiFetch(path, schema, init)` sends cookies, parses the envelope, and checks `data` with Zod. Feature hooks keep the query key next to the feature. Do not cache the same response in another global store.

Same-origin requests are the default. There is no CORS middleware because the browser UI and the API share this origin.
