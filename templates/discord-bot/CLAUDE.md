# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Org-wide conventions (toolchain, script vocabulary, style, deploy patterns, Node version policy) live in [`org-conventions.md`](./org-conventions.md) — vendored from <https://github.com/the-darkwire/conventions>. This file covers what's specific to {{name}}.

## What this is

{{description}}

## Commands

Package manager is **pnpm** (the-darkwire org standard). Runtime executor is **tsx** (no build step; `tsconfig.json` has `noEmit: true`).

- `pnpm dev` / `pnpm start` — runs the bot via `tsx index.ts`
- `pnpm typecheck` / `pnpm lint` / `pnpm test` — feedback loops (see `org-conventions.md` for the full vocabulary)
- `docker compose up --build` — runs the container defined by `Dockerfile` + `compose.yaml`

`.env` must define `DISCORD_TOKEN`; see `.env.example`. Add additional environment variables as needed and document them here.

## Architecture

Entry point is `index.ts`: it constructs a `discord.js` `Client` with the `Guilds` intent and logs in with the token from `env.DISCORD_TOKEN`. Add slash commands, event handlers, and other features as needed.

`src/config/index.ts` wraps `dotenv` and re-exports `process.env`. Anything that reads env vars should import `env` from there so dotenv is guaranteed to have run.

## Gotchas

(none yet — add as they're encountered)
