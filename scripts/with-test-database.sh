#!/usr/bin/env bash
set -euo pipefail

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [[ -z "${DATABASE_URL_TEST:-}" ]]; then
  echo "DATABASE_URL_TEST is required. Copy .env.example to .env or export it in the environment." >&2
  exit 1
fi

export DATABASE_URL="$DATABASE_URL_TEST"
exec "$@"
