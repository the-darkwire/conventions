import { treaty } from "@elysiajs/eden";
import type { App } from "@{{name}}/api";

// `/api` is proxied to the Elysia backend by Vite in dev (see vite.config.ts) and should be
// proxied to the production API by your static host in production. Swap to an absolute URL if
// you'd rather not run a proxy.
export const api = treaty<App>("/api");
