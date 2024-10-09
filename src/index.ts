import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import html from "@elysiajs/html";

const port = process.env.PORT ?? 5432;
const links = Bun.file("temp.txt");

const app = new Elysia()
  .use(cors())
  .state("version", "1.0.0")
  .get("/links", () => {
    return new Response(links, {
      headers: { "Content-Type": "text/html;charset=utf-8" },
    });
  })
  .use(html())
  .put("/links", async ({ body }) => {
    const data = typeof body === "string" ? body : JSON.stringify(body);
    await Bun.write("temp.txt", data);
    return new Response("Links saved successfully", {
      status: 200,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    });
  })
  .onError((error) => {
    console.error("Error writing file:", error);
    return new Response("Failed to save links", {
      status: 500,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    });
  })
  .listen(port, () => console.log(`Server is running on port ${port}`));

export default app;
