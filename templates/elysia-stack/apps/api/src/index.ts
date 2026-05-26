import { app } from "./app";

export type { App } from "./app";

const port = Number(process.env.PORT ?? 3000);
app.listen(port);

console.log(`{{name}}/api listening on http://localhost:${port}`);
