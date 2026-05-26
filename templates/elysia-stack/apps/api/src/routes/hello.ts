import { Elysia, t } from "elysia";

export const helloRoutes = new Elysia({ prefix: "/hello" })
  .get("/", () => ({ message: "Hello from the api" }))
  .post("/:name", ({ params }) => ({ message: `Hello, ${params.name}!` }), {
    params: t.Object({ name: t.String() }),
  });
