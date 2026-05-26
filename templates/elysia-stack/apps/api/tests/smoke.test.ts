import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("api smoke", () => {
  it("responds to GET /hello", async () => {
    const res = await app.handle(new Request("http://localhost/hello"));
    expect(res.status).toBe(200);
    const data = (await res.json()) as { message: string };
    expect(typeof data.message).toBe("string");
  });

  it("responds to POST /hello/:name", async () => {
    const res = await app.handle(
      new Request("http://localhost/hello/world", { method: "POST" }),
    );
    expect(res.status).toBe(200);
    const data = (await res.json()) as { message: string };
    expect(data.message).toContain("world");
  });
});
