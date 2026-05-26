# {{name}}

{{description}}

## Setup

```sh
pnpm install
pnpm dev          # api on :3000, web on :5173
```

The Vite dev server proxies `/api/*` to the backend, so the frontend calls Eden's `api.hello.get()` and the request flows: web (5173) → Vite proxy → Elysia (3000).

You need both **pnpm** (package manager, org-wide standard) and **Bun** (api runtime) installed locally:

```sh
brew install pnpm bun     # macOS
```

## Stack

- **pnpm** — package manager (org-wide standard)
- **Bun** — runtime for the api (Elysia HTTP perf); the web uses Node + Vite
- **Elysia** — backend HTTP framework (`apps/api/`)
- **React + Vite** — frontend (`apps/web/`)
- **Eden treaty** — type-safe contract; the web app imports `App` directly from the api workspace, type-only

See [`CLAUDE.md`](./CLAUDE.md) for architecture, conventions, and gotchas. Org-wide conventions are in [`org-conventions.md`](./org-conventions.md).
