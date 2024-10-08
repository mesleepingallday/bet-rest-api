import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

const port = process.env.PORT || 5432;

const app = new Elysia()
  .use(cors())
  .state("version", "1.0.0")
  .get("/links", () => {
    return links;
  })
  .put("/links", async ({ body }: { body: any }) => {
    const data = await body;
    await Bun.write("./temp.txt", data);
    return { message: "File updated successfully" };
  })
  .listen(port, () => console.log(`Server is running on port ${port}`));

export default app;
