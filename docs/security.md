# Security

## Headers already set

`next.config.ts` sends these on every route:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy` with camera, microphone, and geolocation disabled
- `Content-Security-Policy-Report-Only` for measurement only

`poweredByHeader` is off. `allowedDevOrigins` includes `127.0.0.1` so local dev assets are not treated as cross-origin.

## Content Security Policy, in stages

The report-only policy does not block anything. It exists so a browser can report what a future enforcing policy would break. Do not rename it to `Content-Security-Policy` until the home page, theme toggle, and a production `pnpm start` have been checked in a browser with no script violations.

The current report-only policy allows:

- Same-origin documents, forms, fonts, images, and `/api` calls (`default-src`, `connect-src`, `font-src`, `img-src`, `form-action` are `'self'`, plus `data:` and `blob:` images).
- Next.js scripts and the inline theme bootstrap in `src/app/layout.tsx` (`script-src 'self' 'unsafe-inline'`).
- Styles emitted by Next.js and `next/font` (`style-src 'self' 'unsafe-inline'`).

`'unsafe-inline'` is only acceptable while the header is report-only.

Later stages, after a browser check:

1. Keep the header report-only. Add a per-request nonce in `src/proxy.ts`, put that nonce on the theme `<script>`, and let Next.js nonce its own scripts. Then `script-src` can drop `'unsafe-inline'`.
2. When those reports are clean in `pnpm dev` and `pnpm build && pnpm start`, switch the header name to `Content-Security-Policy`.
3. Tighten `style-src` only after font and theme styles no longer need inline style. Doing that first usually blanks the page.

There is no third-party script, font CDN, or analytics host in this starter. Do not add one to the policy until the app actually loads it.
