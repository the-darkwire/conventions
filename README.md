# the-darkwire/conventions

Source-of-truth for the-darkwire org's shared TypeScript toolchain conventions. The full canon lives in [`org-conventions.md`](./org-conventions.md).

## What's here

The repo is structured in three layers:

### Root canon — applies to every project type

| File | Purpose |
|---|---|
| [`biome.json`](./biome.json) | Canonical Biome lint + format config |
| [`tsconfig.base.json`](./tsconfig.base.json) | Base TS compiler options. Extend from your repo's `tsconfig.json`. |
| [`pnpm-workspace.yaml.example`](./pnpm-workspace.yaml.example) | Annotated example of the workspace file (used for `allowBuilds` in pnpm 11+) |
| [`.nvmrc`](./.nvmrc) | Current org-standard Node version |
| [`org-conventions.md`](./org-conventions.md) | Prose canon: script vocabulary, dependency conventions, style, deploy patterns |

### Per-stack templates — `templates/<type>/`

Each subdirectory is a complete drop-in scaffold for a specific project type, using `{{name}}` and `{{description}}` placeholders. The `scaffolder` agent composes the root canon with the chosen template, substitutes placeholders, and validates.

| Template       | Status        | Notes                                                       |
|----------------|---------------|-------------------------------------------------------------|
| `discord-bot`  | **available** | Discord bot. Stack: discord.js + tsx + Docker + SSH deploy. |

The org's policy is **build first, template second**: don't scaffold a stack you haven't validated in production. Future templates (e.g. `slack-bot`, `api`, `mobile`, `lib`) will land here once the first instance of each is running.

### Shared Claude Code agents — `.claude/agents/`

| Agent | Purpose |
|---|---|
| [`reviewer`](./.claude/agents/reviewer.md) | Pre-PR sanity check. Runs typecheck + lint + tests, flags real issues. Read-only. |
| [`dep-updater`](./.claude/agents/dep-updater.md) | Safely bump dependencies, validating after each group. |
| [`scaffolder`](./.claude/agents/scaffolder.md) | Set up a new repo from a chosen template. |

Consumer repos vendor `reviewer` and `dep-updater` into their own `.claude/agents/` (the scaffolder isn't useful in a mature repo; it stays in this conventions repo only).

## How to consume

Today this is a copy-paste source-of-truth. New repos vendor the relevant files. When a repo's config drifts from this canon, update either the repo (to match) or this canon (if the divergence is intentional and should propagate).

If/when copy-friction becomes painful, we'll publish as `@the-darkwire/conventions` on npm and consumers will `extends` instead. Not yet.

## Adopting in a new repo

```sh
# From your new repo's root, vendor the configs you need:
BASE=https://raw.githubusercontent.com/the-darkwire/conventions/main
curl -O "$BASE/biome.json"
curl -O "$BASE/.nvmrc"
curl -O "$BASE/tsconfig.base.json"
curl -O "$BASE/org-conventions.md"

# Create your pnpm-workspace.yaml from the example, then edit allowBuilds:
curl -o pnpm-workspace.yaml "$BASE/pnpm-workspace.yaml.example"
```

Then in your repo's `tsconfig.json`:

```jsonc
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ESNext"],
    "noEmit": true
  }
}
```

See [`org-conventions.md`](./org-conventions.md) for the standardized script vocabulary your `package.json` should expose.

For Discord bots specifically, the `scaffolder` agent does all of this for you — see [`.claude/agents/scaffolder.md`](./.claude/agents/scaffolder.md).
