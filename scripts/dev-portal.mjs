import { createServer } from "vite";
import { createServer as createHttpServer } from "node:http";
import { handlePortal } from "../server/portal.mjs";
try { process.loadEnvFile(".env.local"); } catch (error) { if (error.code !== "ENOENT") throw error; }
const port = Number(process.env.PORT || 3000);
const vite = await createServer({ server: { middlewareMode: true }, appType: "spa" });
const server = createHttpServer(async (request, response) => {
  const path = new URL(request.url, "http://localhost").pathname;
  if (path === "/area-do-cliente/confirmar") request.url = "/portal-confirm/index.html";
  else if (path === "/area-do-cliente" || path.startsWith("/area-do-cliente/")) request.url = "/portal.html";
  if (path !== "/api/client-portal") return vite.middlewares(request, response);
  response.status = (status) => { response.statusCode = status; return response; };
  response.json = (data) => { response.setHeader("Content-Type", "application/json"); response.end(JSON.stringify(data)); };
  const chunks = [];
  let bytes = 0;
  try {
    for await (const chunk of request) {
      bytes += chunk.length;
      if (bytes > 16384) { response.status(413).json({ message: "Solicitação muito grande." }); return; }
      chunks.push(chunk);
    }
    request.body = Buffer.concat(chunks).toString() || {};
    await handlePortal(request, response);
  } catch {
    if (!response.writableEnded) response.status(400).json({ message: "Solicitação inválida." });
  }
});
server.listen(port, "127.0.0.1", () => console.log(`Portal local: http://localhost:${port}`));
async function close() { await vite.close(); server.close(); }
process.on("SIGINT", close);
process.on("SIGTERM", close);
