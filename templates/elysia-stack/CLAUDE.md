# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Org-wide conventions (toolchain, script vocabulary, style, deploy patterns) live in [`org-conventions.md`](./org-conventions.md) — vendored from <https://github.com/the-darkwire/conventions>. This file covers what's specific to {{name}}.

## Stack split: pnpm for package management, Bun for the api runtime

- **Package manager**: **pnpm** (org-wide standard — same as the bots). `pnpm-lock.yaml` is the lockfile; workspaces live under `apps/*`; `pnpm-workspace.yaml` configures workspaces and `allowBuilds`.
- **Test runner**: **Vitest** (org-wide standard, cross-runtime).
- **Lint/format**: **Biome** (org-wide standard).
- **Api runtime**: **Bun** (for Elysia HTTP perf). The api's `dev`/`start` scripts use `bun --watch src/index.ts` / `bun src/index.ts`. The Dockerfile uses `oven/bun:alpine` as the base.
- **Web runtime**: Node + Vite (Vite's de-facto runtime; works fine alongside Bun on the same machine).

Bun is installed locally as a runtime tool (via `brew install bun` on macOS). It is *not* the package manager — `pnpm install` is what populates `node_modules`. Bun's module resolver handles pnpm's symlinked node_modules cleanly.

## What this is

{{description}}

Full-stack monorepo. Elysia backend in `apps/api/`, React + Vite frontend in `apps/web/`. Type-safe RPC between them via Eden treaty — the frontend imports the backend's `App` type directly from the workspace, so any route change immediately surfaces as autocomplete or a TS error on the frontend.

## Commands

Run from the monorepo root:

- `pnpm dev` — run api + web in parallel (api on :3000, web on :5173)
- `pnpm dev:api` / `pnpm dev:web` — run one at a time
- `pnpm typecheck` — typecheck both apps
- `pnpm lint` / `pnpm check` — Biome at root
- `pnpm test` — run both apps' Vitest suites
- `pnpm build` — build the web app (the api has no build step; Bun runs TS directly)

Per-app scripts (run from `apps/api/` or `apps/web/`):
- api: `pnpm dev` (`bun --watch` underneath), `pnpm start`, `pnpm test`, `pnpm typecheck`
- web: `pnpm dev` (Vite), `pnpm build`, `pnpm test`, `pnpm typecheck`

## Architecture

### Backend (`apps/api/`)

- `src/app.ts` — pure Elysia app builder; exports `app` instance and `App` type. **The web's type import resolves through `apps/api/package.json`'s `main` field, which points here.**
- `src/index.ts` — bootstraps and calls `app.listen()`. Imports `app` from `./app`.
- `src/routes/<name>.ts` — domain-grouped route modules; each exports an `Elysia` chain that gets mounted via `app.use(...)` in `app.ts`.

When adding a route: define it as an Elysia chain in `src/routes/`, then `app.use(...)` it in `app.ts`. The frontend's `treaty<App>(...)` will pick up the new path automatically.

### Frontend (`apps/web/`)

- `src/api.ts` — `treaty<App>("/api")`. The `/api` prefix is proxied by Vite to the backend in dev.
- `src/main.tsx` — React bootstrap, wraps in `QueryClientProvider`.
- `src/App.tsx` — example query using `useQuery` + the typed `api` client.

Calls go: `api.hello.get()` → Vite proxy → backend `/hello`. In production, configure your static host to proxy similarly, or change the treaty target to an absolute API URL.

## Gotchas

- **`app.listen()` lives in `index.ts`, not `app.ts`.** Importing `app` for tests must not bind a port. Tests use `app.handle(new Request(...))` to invoke routes directly without starting a server.
- **Eden path params** use function-call syntax: `api.foo({ id: 42 }).bar.get()`. Looks weird; it's how Eden encodes URL params in the typed treaty.
- **TypeBox, not Zod.** Schemas are `t.Object({ ... })`, `t.String()`, etc., imported from `"elysia"`. Different DX than Zod but produces JSON Schema natively (used by `@elysiajs/swagger` for the bundled docs at `/swagger`).
- **The web depends on the api as a workspace package** (`@{{name}}/api`). pnpm's workspace resolver links them at install time. Type-only import means **no runtime coupling** — Elysia's code never ships to the browser bundle.
- **Vitest, not `bun:test`.** Tests use `import { describe, expect, it } from "vitest"`. Bun's `bun:test` would also work but Vitest is the org standard and runs in either runtime.
- **Bun + pnpm coexist fine** — `pnpm install` populates `node_modules`, then `bun src/index.ts` runs it. You need both installed locally (`brew install bun` if missing; pnpm comes from corepack or `brew install pnpm`).
- **The api Dockerfile expects the monorepo root as build context.** `apps/api/compose.yaml` already sets this; if building manually, run `docker build -f apps/api/Dockerfile .` from the repo root.

## Deployment

- `.github/workflows/deploy-api.yml` deploys the backend to the production droplet (same SSH pattern as the org's Discord bots; expects repo secrets `DEPLOY_HOST` and `DEPLOY_SSH_KEY`). Triggered on changes to `apps/api/**` or shared root files.
- `.github/workflows/deploy-web.yml` builds the frontend on every push and **stops at the build step** — you need to wire up your chosen static host (Cloudflare Pages, Vercel, S3, etc.). See the commented examples at the bottom of that workflow.
