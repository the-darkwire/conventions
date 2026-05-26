# the-darkwire/conventions

Source-of-truth for the-darkwire org's shared TypeScript toolchain conventions. The full canon lives in [`org-conventions.md`](./org-conventions.md).

## What's here

| File | Purpose |
|---|---|
| [`biome.json`](./biome.json) | Canonical Biome lint + format config |
| [`tsconfig.base.json`](./tsconfig.base.json) | Base TS compiler options. Extend from your repo's `tsconfig.json`. |
| [`pnpm-workspace.yaml.example`](./pnpm-workspace.yaml.example) | Annotated example of the workspace file (used for `allowBuilds` in pnpm 11+) |
| [`.nvmrc`](./.nvmrc) | Current org-standard Node version |
| [`org-conventions.md`](./org-conventions.md) | Prose canon: script vocabulary, dependency conventions, style, deploy patterns |

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
