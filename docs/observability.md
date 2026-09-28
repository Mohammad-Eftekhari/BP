# Observability

`src/lib/logger/logger.ts` is the only logging boundary. Server code should call `logger.info` or `logger.error` instead of writing its own log lines.

The logger writes one JSON line to stdout or stderr. Before it writes, it redacts object keys named `password`, `token`, `secret`, `authorization`, `cookie`, `set-cookie`, and `email`. Do not log those values under a different key.

Unexpected Route Handler failures already go through this logger from `src/lib/api/response.ts`. The HTTP response stays a generic `INTERNAL_ERROR` and does not include the log line.

## Adding a provider later

Do not add Sentry, Datadog, or another vendor to this starter until a specification asks for it. The plug-in point is `logger.ts`: replace the `console.info` / `console.error` calls inside `write` with that provider's server SDK.

Keep the DSN or API key in a server environment variable validated in `src/lib/env/server.ts`. Do not use a `NEXT_PUBLIC_` name for a DSN that must stay on the server. A public DSN is only justified when the browser SDK must send events itself, and that choice belongs in the specification. The provider must receive the same redacted context the logger already builds, not raw request headers or request bodies.
