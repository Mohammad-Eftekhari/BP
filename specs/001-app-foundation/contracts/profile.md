# Contract: Profile

The profile id is never taken from the client. The server uses the authenticated account.

## `GET /api/profile`

Authentication: required.

### Success `200`

Returns the account's profile, creating nothing. When no row exists, `displayName` falls back to the account name and `bio` is empty. `persisted` is false until the first save.

```json
{
  "success": true,
  "data": {
    "displayName": "Ada Lovelace",
    "bio": "",
    "persisted": false
  }
}
```

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

## `PUT /api/profile`

Authentication: required.

### Body

```json
{
  "displayName": "Ada Lovelace",
  "bio": "Mathematician"
}
```

`displayName` is required, trimmed, 1–80 characters. `bio` is optional, trimmed, at most 280 characters. Omitted bio is stored as an empty string.

### Success `200`

```json
{
  "success": true,
  "data": {
    "displayName": "Ada Lovelace",
    "bio": "Mathematician",
    "persisted": true
  }
}
```

### Invalid body `400`

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

## Shared error codes

| Code                | Status |
| ------------------- | ------ |
| VALIDATION_ERROR    | 400    |
| UNAUTHENTICATED     | 401    |
| FORBIDDEN           | 403    |
| NOT_FOUND           | 404    |
| CONFLICT            | 409    |
| BUSINESS_RULE       | 422    |
| RATE_LIMITED        | 429    |
| SERVICE_UNAVAILABLE | 503    |
| INTERNAL_ERROR      | 500    |
