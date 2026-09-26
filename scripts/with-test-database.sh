#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f .env ]]; then
  echo "Copy .env.example to .env first." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

if [[ -z "${DATABASE_URL_TEST:-}" ]]; then
  echo "DATABASE_URL_TEST is required." >&2
  exit 1
fi

export DATABASE_URL="$DATABASE_URL_TEST"
exec "$@"
