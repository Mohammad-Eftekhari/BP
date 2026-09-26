# Contract: Status

## `GET /api/health`

Authentication: none.

### Success `200`

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "database": "up"
  }
}
```

### Data store unavailable `503`

```json
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Service unavailable"
  }
}
```

The body MUST NOT include SQL, connection strings, or stack traces.
