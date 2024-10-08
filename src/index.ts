import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

const port = process.env.PORT ?? 5432;
const links = Bun.file("./temp.txt");

const app = new Elysia()
  .use(cors())
  .state("version", "1.0.0")
  .get("/links", async () => {
    const content = await links.text(); // Đọc nội dung file dưới dạng text
    return new Response(content, {
      headers: {
        "Content-Type": "text/html", // Định dạng content type là text/html
      },
    });
  })
  .put("/links", async ({ body, headers }) => {
    const contentType = headers["content-type"];

    // Kiểm tra Content-Type từ request, chỉ chấp nhận text/html
    if (contentType !== "text/html") {
      return new Response(
        JSON.stringify({
          error: "Invalid content type. Only text/html is accepted.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await body.text(); // Lấy nội dung HTML từ body request
    await Bun.write("./temp.txt", data); // Ghi nội dung vào file temp.txt
    return new Response(
      JSON.stringify({ message: "File updated successfully" }),
      { headers: { "Content-Type": "application/json" } }
    );
  })
  .listen(port, () => console.log(`Server is running on port ${port}`));

export default app;
