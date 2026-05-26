# {{name}}

{{description}}

## Setup

1. Copy `.env.example` to `.env` and fill in the required values.
2. `pnpm install`
3. `pnpm dev` to run locally.

## Commands

See [`org-conventions.md`](./org-conventions.md) for the standardized the-darkwire script vocabulary (`dev`, `start`, `typecheck`, `lint`, `lint:fix`, `format`, `check`, `test`, `test:watch`).

## Deployment

`.github/workflows/deploy.yml` SSHes into the production droplet on push-to-main and runs `git reset --hard origin/main && docker compose up -d --build` from `/root/{{name}}`. Requires repo secrets `DEPLOY_HOST` and `DEPLOY_SSH_KEY`. The droplet's `.env` lives at `/root/{{name}}/.env` (not in git, not in the image — `compose.yaml` injects it via `env_file:`).
