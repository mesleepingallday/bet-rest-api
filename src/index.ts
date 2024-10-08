import { Elysia } from "elysia";

const links = Bun.file("./temp.txt", { type: "application/json" });

const app = new Elysia()
  .state("version", "1.0.0")
  .get("/links", () => {
    return links;
  })
  .put("/links", async ({ body }: { body: any }) => {
    const data = await body;
    await Bun.write("./temp.txt", data);
    return { message: "File updated successfully" };
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
