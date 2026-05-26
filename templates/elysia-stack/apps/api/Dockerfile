# syntax=docker/dockerfile:1
#
# Build from the monorepo root: `docker build -f apps/api/Dockerfile .`
# (compose.yaml in this directory sets context: ../.. for you.)
#
# Bun is the runtime (for Elysia HTTP perf). pnpm is the package manager (org-wide standard).
# Node is added solely so corepack can activate pnpm.

ARG BUN_VERSION=1.3.14
ARG PNPM_VERSION=11.3.0

FROM oven/bun:${BUN_VERSION}-alpine

# pnpm via npm. Alpine's nodejs package doesn't bundle corepack as a separate binary,
# so we install pnpm globally via npm. Both go away after the deps layer; only the
# resolved node_modules ride forward into the runtime image (single-stage here for simplicity).
RUN apk add --no-cache nodejs npm && npm install -g pnpm@${PNPM_VERSION}

ENV NODE_ENV=production

WORKDIR /app

# Install workspace prod deps. Bind-mount only the lockfile + manifests so the layer is cached
# until those change.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=bind,source=pnpm-workspace.yaml,target=pnpm-workspace.yaml \
    --mount=type=bind,source=apps/api/package.json,target=apps/api/package.json \
    --mount=type=bind,source=apps/web/package.json,target=apps/web/package.json \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

# Copy source. .dockerignore excludes node_modules, .env, .git, etc.
COPY . .

USER bun

CMD ["bun", "apps/api/src/index.ts"]
