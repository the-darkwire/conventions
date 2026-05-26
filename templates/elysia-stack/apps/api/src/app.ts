import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { helloRoutes } from "./routes/hello";

export const app = new Elysia().use(swagger()).use(helloRoutes);

export type App = typeof app;
