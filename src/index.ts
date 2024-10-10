import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import html from "@elysiajs/html";

const port = process.env.PORT ?? 5432;

const app = new Elysia().use(cors()).state("version", "1.0.0").use(html());

function createRoutes(app: Elysia, routeName: string, fileName: string) {
  return app
    .get(`/${routeName}`, () => {
      const file = Bun.file(fileName);
      return new Response(file, {
        headers: { "Content-Type": "text/html;charset=utf-8" },
      });
    })
    .put(`/${routeName}`, async ({ body }) => {
      const data = typeof body === "string" ? body : JSON.stringify(body);
      await Bun.write(fileName, data);
      return new Response(`${routeName} saved successfully`, {
        status: 200,
        headers: { "Content-Type": "text/plain;charset=utf-8" },
      });
    });
}

createRoutes(app, "thongtinthem", "thongtinthem.txt");
createRoutes(app, "lienkethuuich", "lienkethuuich.txt");

app
  .onError((error) => {
    console.error("Error writing file:", error);
    return new Response("Failed to save links", {
      status: 500,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    });
  })
  .listen(port, () => console.log(`Server is running on port ${port}`));
